pipeline {
    agent any
    stages {
        stage('Init') {
            steps {
                echo 'Testing..'
                telegramSend(message: 'Building job: $PROJECT_NAME ... - Link: $BUILD_URL', chatId: -740504133)
            }
        }
        stage ('Deployments') {
            steps {
                echo 'Deploying to Production environment...'
                echo 'Copy project over SSH...'
                sshPublisher(publishers: [
                    sshPublisherDesc(
                        configName: 'swarm1',
                        transfers:
                            [sshTransfer(
                                cleanRemote: false,
                                excludes: '',
                                execCommand: "docker build -t registry.thinklabs.com.vn:5000/quanlynhansuweb ./thinklabsdev/quanlynhansuwebCI/ \
                                    && docker image push registry.thinklabs.com.vn:5000/quanlynhansuweb \
                                    && docker service rm quanlynhansu_web || true \
                                    && docker stack deploy -c ./thinklabsdev/quanlynhansuwebCI/docker-compose.yml quanlynhansu \
                                    && rm -rf ./thinklabsdev/quanlynhansuwebCIB \
                                    && mv ./thinklabsdev/quanlynhansuwebCI/ ./thinklabsdev/quanlynhansuwebCIB",
                                execTimeout: 1200000,
                                flatten: false,
                                makeEmptyDirs: false,
                                noDefaultExcludes: false,
                                patternSeparator: '[, ]+',
                                remoteDirectory: './thinklabsdev/quanlynhansuwebCI',
                                remoteDirectorySDF: false,
                                removePrefix: '',
                                sourceFiles: '*, src/, server/, webpack/, public/'
                            )],
                        usePromotionTimestamp: false,
                        useWorkspaceInPromotion: false,
                        verbose: false
                    )
                ])
                telegramSend(message: 'Build - $PROJECT_NAME – # $BUILD_NUMBER – STATUS: $BUILD_STATUS!', chatId: -740504133)

            }
        }
    }
}
