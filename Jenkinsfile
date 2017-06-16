#!groovy

node {

	projectName = "iot-admin-api"

	def sanitizedBuildTag = sh script: "echo -n '${env.BUILD_TAG}' | sed -r 's/[^a-zA-Z0-9_.-]//g' | tr '[:upper:]' '[:lower:]'", returnStdout: true
	imageName = "${projectName}-${sanitizedBuildTag}"

	try {
		stage('Checkout') {
	      checkout scm

	      // Jean-Michel Enattendant
	      // Pour l'instant Jenkins n'ignore pas les messages de commit chore(release) du à un bug Jenkins, en attendant on fait une chinoiserie.
	      // De ce fait on aura 2 builds successifs avec le second en erreur, mais on ne bouclera pas.
	      // https://issues.jenkins-ci.org/browse/JENKINS-36836
	      // https://issues.jenkins-ci.org/browse/JENKINS-36195
	      def lastCommitMessage = sh script: 'git log -1 --pretty=oneline', returnStdout: true
	      if (lastCommitMessage =~ /chore\(release\):/) {
	        jeanMichelAbortBuild = true
	        sh "echo 'Last commit is from Jenkins release, cancel execution'"
	        sh "exit 1"
	      }
	    }

	    stage('Build project') {
			docker.build("${imageName}", '.')
		}
/*


	    if (isRelease()) {
	        stage('Release') {
	        	releaseImageName = "${projectName}-release"
				docker.build(releaseImageName, "-f Dockerfile.release .")
					sshagent (credentials: ['github_jenkins']) {
					sh "docker run --rm -v /var/jenkins_home/.ssh/id_rsa:/root/.ssh/id_rsa -v \$(pwd):/usr/src/app/ ${releaseImageName} bash -c 'make release'"
				}
				sh "docker rmi ${releaseImageName}"

				docker.build("${dockerServiceImage}", '.')

				// Now the release is done if needed, retrieve version number
				version = getNPMVersion(readFile('package.json'))
				dockerImageVersion = "denouche/${projectName}:${version}"
				sh "docker tag ${dockerServiceImage} ${dockerImageVersion}"
				docker.withRegistry('https://index.docker.io/v1/', 'dockerhub') {
					sh "docker push ${dockerImageVersion}"
				}

				// Push the commit and the git tag only if docker image was successfully pushed
				sshagent (credentials: ['github_jenkins']) {
					sh "git remote -v"
					sh "git push --follow-tags origin HEAD"
				}
	        }
	    }*/
    }
	finally {
		if(jeanMichelAbortBuild) {
			currentBuild.result = 'ABORTED'
		}
	}

}


@NonCPS
def getNPMVersion(text) {
  def matcher = text =~ /"version"\s*:\s*"([^"]+)"/
  matcher ? matcher[0][1] : null
}

@NonCPS
def isRelease() {
  env.BRANCH_NAME == "master" || env.BRANCH_NAME ==~ /^maintenance\/.+/
}
