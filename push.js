const { execSync } = require('child_process');

function execLog(...args) {
    console.log(...args);
    return execSync(...args);
}

function find_docker() {
    try {
        execSync(`docker --version`, {stdio: 'pipe'});
        return 'docker';
    }
    catch {
        execSync(`podman --version`, {stdio: 'pipe'});
        return 'podman';
    }
}

function docker_build(context, tag) {
    docker = find_docker();
    cmd = `${docker} build -t ${tag} ${context}`;
    return execLog(cmd).toString();
}

function docker_push(tag) {
    docker = find_docker();
    cmd = `${docker} push ${tag}`;
    return execLog(cmd).toString();
}

function npm_versions(pkg) {
    cmd = `npm view ${pkg} versions --json`;
    return JSON.parse(execLog(cmd));
}

function npm_install(pkg, version) {
    cmd = `npm install --save --json ${pkg}@${version}`;
    return JSON.parse(execLog(cmd));
}

// (1) List versions available on npm.
// For each versions:
// (2) Generate the package(-lock).json files.
// (3) Build and tag the Docker image.
// (4) Push the image to Docker Hub.

// TODO: `latest` tag.

const pkg = "@krypton-org/krypton-auth";
const basetag = "krypton-org/krypton-auth";

versions = npm_versions(pkg);

for (const version of versions) {
    npm_install(pkg, version);
    tag = basetag + `:${version}`;
    docker_build(".", tag);
    docker_push(tag);
}
