# ecr-images-purifier

Lambda function based on Serverless framework for removing old ECR images every 24 hours.

### Installation
```
npm install -g serverless
```

### Usage
Open `serverless.yml` and adjust environment variables at the bottom of file.

Invoke locally:
```
sls invoke local -f purify
```

Deployment:
```
sls deploy -f purify
```

Manual Invocation:
```
sls invoke -f putify
```