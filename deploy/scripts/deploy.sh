#!/bin/bash

###############################################################################
# Koman Coffee 生产环境部署脚本
# 用于自动化部署流程
###############################################################################

set -e  # 遇到错误立即退出

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 配置变量
PROJECT_DIR="/var/www/koman-coffee"
SERVER_DIR="${PROJECT_DIR}/server"
BACKUP_DIR="${PROJECT_DIR}/backups"
LOG_FILE="${PROJECT_DIR}/deploy.log"

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Koman Coffee 部署脚本${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# 日志函数
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a ${LOG_FILE}
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a ${LOG_FILE}
    exit 1
}

warn() {
    echo -e "${YELLOW}[WARN]${NC} $1" | tee -a ${LOG_FILE}
}

# 检查环境
check_environment() {
    log "检查运行环境..."
    
    # 检查 Node.js
    if ! command -v node &> /dev/null; then
        error "Node.js 未安装，请先安装 Node.js"
    fi
    NODE_VERSION=$(node -v)
    log "✓ Node.js 版本: ${NODE_VERSION}"
    
    # 检查 npm
    if ! command -v npm &> /dev/null; then
        error "npm 未安装"
    fi
    NPM_VERSION=$(npm -v)
    log "✓ npm 版本: ${NPM_VERSION}"
    
    # 检查 PM2
    if ! command -v pm2 &> /dev/null; then
        warn "PM2 未安装，将自动安装..."
        npm install -g pm2
    fi
    log "✓ PM2 已安装"
    
    # 检查 MongoDB
    if ! systemctl is-active --quiet mongod; then
        warn "MongoDB 未运行，尝试启动..."
        sudo systemctl start mongod || error "MongoDB 启动失败"
    fi
    log "✓ MongoDB 运行中"
    
    # 检查 Git
    if ! command -v git &> /dev/null; then
        error "Git 未安装"
    fi
    log "✓ Git 已安装"
}

# 创建备份
create_backup() {
    log "创建备份..."
    
    mkdir -p ${BACKUP_DIR}
    BACKUP_NAME="backup_$(date +'%Y%m%d_%H%M%S').tar.gz"
    
    if [ -d ${SERVER_DIR} ]; then
        cd ${PROJECT_DIR}
        tar -czf ${BACKUP_DIR}/${BACKUP_NAME} server/ --exclude=node_modules --exclude=logs
        log "✓ 备份已创建: ${BACKUP_NAME}"
    else
        warn "项目目录不存在，跳过备份"
    fi
}

# 拉取代码
pull_code() {
    log "拉取最新代码..."
    
    if [ -d ${PROJECT_DIR}/.git ]; then
        cd ${PROJECT_DIR}
        git fetch origin
        git pull origin main || error "代码拉取失败"
        log "✓ 代码已更新"
    else
        warn "不是 Git 仓库，跳过代码拉取"
    fi
}

# 安装依赖
install_dependencies() {
    log "安装项目依赖..."
    
    cd ${SERVER_DIR}
    npm install --production || error "依赖安装失败"
    log "✓ 依赖安装完成"
}

# 检查数据库连接
check_database() {
    log "检查数据库连接..."
    
    if mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
        log "✓ 数据库连接正常"
    else
        error "数据库连接失败"
    fi
}

# 重启应用
restart_application() {
    log "重启应用..."
    
    cd ${SERVER_DIR}
    
    # 检查 PM2 进程是否存在
    if pm2 list | grep -q "koman-coffee-api"; then
        log "使用 PM2 重载应用（零停机）..."
        pm2 reload ecosystem.config.js --env production || error "应用重载失败"
    else
        log "首次启动应用..."
        pm2 start ecosystem.config.js --env production || error "应用启动失败"
        pm2 save || warn "PM2 配置保存失败"
    fi
    
    log "✓ 应用已重启"
}

# 健康检查
health_check() {
    log "执行健康检查..."
    
    sleep 5  # 等待应用启动
    
    MAX_RETRIES=5
    RETRY_COUNT=0
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
        if curl -f http://localhost:3000/health > /dev/null 2>&1; then
            log "✓ 健康检查通过"
            return 0
        fi
        
        RETRY_COUNT=$((RETRY_COUNT + 1))
        warn "健康检查失败，重试 ${RETRY_COUNT}/${MAX_RETRIES}..."
        sleep 3
    done
    
    error "健康检查失败，应用可能未正常启动"
}

# 清理旧备份
cleanup_old_backups() {
    log "清理旧备份（保留最近5个）..."
    
    cd ${BACKUP_DIR}
    ls -t | tail -n +6 | xargs -r rm --
    log "✓ 旧备份已清理"
}

# 显示部署信息
show_deployment_info() {
    echo ""
    log "========================================="
    log "部署完成！"
    log "========================================="
    log "应用状态："
    pm2 list
    echo ""
    log "查看日志: pm2 logs koman-coffee-api"
    log "查看监控: pm2 monit"
    log "========================================="
}

# 主函数
main() {
    log "开始部署流程..."
    
    check_environment
    create_backup
    pull_code
    install_dependencies
    check_database
    restart_application
    health_check
    cleanup_old_backups
    show_deployment_info
    
    log "✓ 部署成功完成！"
}

# 执行主函数
main
