# Mesaj

## Prerequisites

* Node.js
* npm
* git
* go

## Before getting started

1. Install AWS Amplify

    ```bash
    npm install -g @aws-amplify/cli
    ```
    
2. If you've never used amplify before, you need to configure it

    ```bash
    amplify configure
    ```

## Deploying the app

1. Clone this repo and move into it

    ```bash
    git clone git@github.com:milesnash/mesaj.git
    cd mesaj
    ```

2. Initialise amplify

    ```bash
    amplify init
    ```

3. Publish the front and backend

   **WARNING** This will provision resources in AWS for which you may be charged.

    ```bash
    amplify publish
    ```
    
4. Browse to the frontend URL that amplify outputs and you're done!
