<div align="center">
  <br />
  <p>
    <a href="https://wwebjs.dev">
      <img src="https://github.com/wwebjs/logos/blob/main/4_Full%20Logo%20Lockup_Small/small_banner_blue.png?raw=true" title="whatsapp-web.js" alt="WWebJS Website" width="500" />
    </a>
  </p>
  <br />
  <p>
    <a href="https://www.npmjs.com/package/whatsapp-web.js">
      <img src="https://img.shields.io/npm/v/whatsapp-web.js.svg" alt="npm" />
    </a>
  </p>
  <br />
</div>

# 🚀 The WhatsApp-Web.js Educational Fork

## TL;DR  
This is a **teaching fork** of [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js).  
We added **console.log statements inside the core library** so you can watch how data flows in and out, making it easier to understand how Node.js libraries actually work.  

---

## About

Welcome to the **WhatsApp-Web.js Educational Fork**!  
This is a modified version of the official `whatsapp-web.js` library, meticulously crafted to help aspiring developers understand how a Node.js library works behind the scenes.

Our primary focus is on teaching students what the library **expects** as input and what it **produces** as a result.  
To achieve this, we have strategically placed `console.log` statements directly within the library's core functions.  
This means you will see a detailed log of data flowing through the library as you interact with it—all without needing to add any logging code to your own project!

**This is a learning tool**, and in no way have we modified the code to do unauthorized activities or enabled any form of misuse of the library.

### Who We Are
This educational fork was proudly modded by **Ernest Tech House** and coded by **Pease Ernest**.

**A WhatsApp API client that connects through the WhatsApp Web browser app**

The library works by launching the WhatsApp Web browser application and managing it using Puppeteer to create an instance of WhatsApp Web, thereby mitigating the risk of being blocked.  
The WhatsApp API client connects through the WhatsApp Web browser app, accessing its internal functions.  
This grants you access to nearly all the features available on WhatsApp Web, enabling dynamic handling similar to any other Node.js application.

> [!IMPORTANT]  
> **It is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.**


## Links

- [Website](https://wwebjs.dev)  
- [Guide](https://guide.wwebjs.dev/guide) ([source](https://github.com/wwebjs/wwebjs.dev/tree/main))  
- [Documentation](https://docs.wwebjs.dev/) ([source](https://github.com/pedroslopez/whatsapp-web.js/tree/main/docs))  
- [Discord](https://discord.gg/H7DqQs4)  
- [GitHub](https://github.com/pedroslopez/whatsapp-web.js)  
- [npm](https://npmjs.org/package/whatsapp-web.js)

---

## Installation

The module is now available on npm!  

```bash
npm i whatsapp-web.js
````

> \[!NOTE]
> **Node `v18+` is required.**

---

## QUICK STEPS TO UPGRADE NODE

### Windows

#### Manual

Get the latest LTS from the [official Node.js website](https://nodejs.org/en/download/).

#### npm

```powershell
sudo npm install -g n
sudo n stable
```

#### Choco

```powershell
choco install nodejs-lts
```

#### Winget

```powershell
winget install OpenJS.NodeJS.LTS
```

### Ubuntu / Debian

```bash
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

---

## Example usage

```js
const { Client } = require('whatsapp-web.js');

const client = new Client();

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message', msg => {
    if (msg.body == '!ping') {
        msg.reply('pong');
    }
});

client.initialize();
```

See [example.js](https://github.com/pedroslopez/whatsapp-web.js/blob/master/example.js) for more use cases.
For further details on saving and restoring sessions, check out the [Authentication Strategies](https://wwebjs.dev/guide/creating-your-bot/authentication.html).

---

## Supported features

| Feature                                          | Status                                                                                                                                | Why this is a great feature to study                                            |
| :----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------ |
| Multi Device                                     | ✅                                                                                                                                     | Learn how a single bot can manage multiple simultaneous connections.            |
| Send messages                                    | ✅                                                                                                                                     | Understand how a string of text is packaged and sent to an endpoint.            |
| Receive messages                                 | ✅                                                                                                                                     | See the full message object data you receive, from the body to the sender's ID. |
| Send media (images/audio/documents)              | ✅                                                                                                                                     | Explore how media files are handled and uploaded.                               |
| Send media (video)                               | ✅ [(requires Google Chrome)](https://wwebjs.dev/guide/creating-your-bot/handling-attachments.html#caveat-for-sending-videos-and-gifs) | Learn about browser dependencies and specific video handling.                   |
| Send stickers                                    | ✅                                                                                                                                     | See how custom content is converted into a WhatsApp-supported format.           |
| Receive media (images/audio/video/documents)     | ✅                                                                                                                                     | Witness how incoming media is processed and converted into usable data.         |
| Send contact cards                               | ✅                                                                                                                                     | Discover how to handle complex data types like contact information.             |
| Send location                                    | ✅                                                                                                                                     | Study how geospatial coordinates are formatted and sent.                        |
| Send buttons                                     | ❌  [(DEPRECATED)](https://www.youtube.com/watch?v=hv1R1rLeVVE)                                                                        | A great example of a feature being phased out and how a library manages it.     |
| Send lists                                       | ❌  [(DEPRECATED)](https://www.youtube.com/watch?v=hv1R1rLeVVE)                                                                        | Another opportunity to see how deprecation is handled.                          |
| Receive location                                 | ✅                                                                                                                                     | Observe how incoming location data is parsed.                                   |
| Message replies                                  | ✅                                                                                                                                     | Learn the mechanics of replying to a specific message thread.                   |
| Join groups by invite                            | ✅                                                                                                                                     | See how an invite link is converted to a group ID.                              |
| Get invite for group                             | ✅                                                                                                                                     | Study the process of generating and retrieving a new invite link.               |
| Modify group info (subject, description)         | ✅                                                                                                                                     | Understand how metadata changes are sent and received.                          |
| Modify group settings (send messages, edit info) | ✅                                                                                                                                     | Learn how permissions and group settings are toggled programmatically.          |
| Add group participants                           | ✅                                                                                                                                     | Witness how participant IDs are added to a group.                               |
| Kick group participants                          | ✅                                                                                                                                     | See how participants are removed from a group.                                  |
| Promote/demote group participants                | ✅                                                                                                                                     | Study the process of changing a user's role.                                    |
| Mention users                                    | ✅                                                                                                                                     | Learn how to tag specific users in a message.                                   |
| Mention groups                                   | ✅                                                                                                                                     | Observe how an entire group can be mentioned.                                   |
| Mute/unmute chats                                | ✅                                                                                                                                     | See how chat notifications are controlled.                                      |
| Block/unblock contacts                           | ✅                                                                                                                                     | A key feature for understanding contact management.                             |
| Get contact info                                 | ✅                                                                                                                                     | Explore how contact data is retrieved.                                          |
| Get profile pictures                             | ✅                                                                                                                                     | Learn how image data is fetched.                                                |
| Set user status message                          | ✅                                                                                                                                     | Understand how user profiles are updated.                                       |
| React to messages                                | ✅                                                                                                                                     | See how emoji reactions are handled.                                            |
| Create polls                                     | ✅                                                                                                                                     | The perfect example for understanding how complex objects are created and sent. |
| Channels                                         | ✅                                                                                                                                     | A new feature to learn from.                                                    |
| Vote in polls                                    | 🔜                                                                                                                                    | Stay tuned!                                                                     |
| Communities                                      | 🔜                                                                                                                                    | Stay tuned!                                                                     |

---

## Contributing

As this is a carefully crafted educational library, we are not accepting any further modifications at this time.
However, if you find a bug or a typo in our learning-focused code, please feel free to open an issue!

---

## Supporting the project

You can support **Ernest Tech House** through the links below:

* [GitHub Sponsors](https://github.com/sponsors)
* [PayPal](https://paypal.me) *(replace with your PayPal if you want direct support)*
* [DigitalOcean Referral](https://m.do.co/c/73f906a36ed4) — get \$200 credit when you sign up

---

## Disclaimer

This project is not affiliated, associated, authorized, endorsed by, or in any way officially connected with WhatsApp or any of its subsidiaries or affiliates.
The official WhatsApp website can be found at [whatsapp.com](https://whatsapp.com).

"WhatsApp" as well as related names, marks, emblems and images are registered trademarks of their respective owners.

Also it is not guaranteed you will not be blocked by using this method. WhatsApp does not allow bots or unofficial clients on their platform, so this shouldn't be considered totally safe.

---

## License

Copyright 2025 Pease Ernest

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this project except in compliance with the License.
You may obtain a copy of the License at [http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0).

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.

