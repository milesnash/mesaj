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

2.  Install npm dependencies

    ```bash
    npm i
    ```

3.  Initialise amplify

    ```bash
    amplify init
    ```

    Your answers to the init questions might look like these:

    ![amplify-init](doc/images/amplify-init.png)

    Note that if you choose `prod` as your environment, the next step will create an optimised production build for the frontend.

4. Publish the front and backend

   **WARNING** This will provision resources in AWS for which you may be charged.

    ```bash
    amplify publish
    ```
    
5. Browse to the frontend URL that amplify outputs and you're done!

    Note that the backend sometimes takes a little more time to fully deploy than it takes for amplify to publish the frontend app to S3, so you may initially see the error "Failed to retrieve messages from the server 😭".  Fear not, try refreshing and after some time it will change to "You haven't send a message yet!".  At this point, you'll be good to post a message.  I have seen this take 10 minutes.



## Clean up

1. Run `amplify delete` to remove everything amplify published above from AWS. Note that this will delete a number of project files locally as well. Run `git checkout .` to return to a clean state.
