# CI/CD Demo

When pushing a tag to this repository, the CI/CD Workflow/Pipeline will connect to the production server (a docker container for demonstration purposes) over ssh and deploy this repo there using rsync. The pipeline configuration is available for GitHub and GitLab. You need to set some secrets/environment variables in GitHub/GitLab (more information below).

## Generating SSH Key and encoding with Base64

Generate the SSH Keypair with empty passphrase and empty comment and encode the _private_ key with Base64.

### Bash

```bash
ssh-keygen -q -b 4096 -t rsa -N "" -C "" -f ./.ssh/id_rsa
cat ./.ssh/id_rsa | base64 -w0
```

### PowerShell

```powershell
ssh-keygen -q -b 4096 -t rsa -N '""' -C '""' -f ./.ssh/id_rsa
$txt = Get-Content -Raw ./.ssh/id_rsa
[Convert]::ToBase64String([Text.Encoding]::UTF8.GetBytes($txt), [Base64FormattingOptions]::None)
```

## Adding Secrets/Environment Variables to GitHub/GitLab

-   `SSH_PRIVATE_KEY_B64=` **Base64-Encoded-Private-Key**
-   `SSH_REMOTE_DIR=/var/www`
-   `SSH_REMOTE_HOST=example.com`
-   `SSH_REMOTE_PORT=2222`
-   `SSH_REMOTE_USER=root`

### GitHub

Navigate to **Actions secrets** settings of your repository

-   Settings &rightarrow; Secrets &rightarrow; Actions
-   Append `settings/secrets/actions/new` to the repository URL
-   New repository secret

### GitLab

Navigate to **CI/CD** settings of your repository

-   Settings &rightarrow; CI/CD
-   Append `/-/settings/ci_cd` to the repository URL
-   Variables &rightarrow; Add Variable
    -   Type: Variable
    -   Environment scope: All (default)
    -   Protect variable: &cross;
    -   Mask variable: &cross; (except **SSH_PRIVATE_KEY_B64**: &check;)

## Add SSH Key to authorized keys of production server

Add the generated _public_ key to the **authorized_keys** file of the production server.

### Bash

```bash
cat ./.ssh/id_rsa.pub >> ./production-server/.ssh/authorized_keys
```

### PowerShell

**Note:** use PowerShell 6+ and check for Encoding/EOL after command

```powershell
cat ./.ssh/id_rsa.pub >> ./production-server/.ssh/authorized_keys
```

## Setup production server (only for this demo)

### Configuration

Customize the launch script at `./production-server/start.sh` and the `docker-compose.yml`.

### Build & Run

```bash
cd production-server
docker compose build --no-cache --pull
docker compose up -d
```

## Trigger this Workflow/Pipeline

Trigger the CI/CD Workflow/Pipeline by pushing a **tag** to the main branch of the repository:

```bash
git push -d origin v1.0
git tag -d v1.0
git tag v1.0
git push --tags
```
