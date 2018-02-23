/*-----------------------------------------------------------------------------
A simple echo bot for the Microsoft Bot Framework. 
-----------------------------------------------------------------------------*/

var restify = require('restify');
var builder = require('botbuilder');
var botbuilder_azure = require("botbuilder-azure");

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat connector for communicating with the Bot Framework Service
var connector = new builder.ChatConnector({
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
    openIdMetadata: process.env.BotOpenIdMetadata 
});

// Listen for messages from users 
server.post('/api/messages', connector.listen());

/*----------------------------------------------------------------------------------------
* Bot Storage: This is a great spot to register the private state storage for your bot. 
* We provide adapters for Azure Table, CosmosDb, SQL Azure, or you can implement your own!
* For samples and documentation, see: https://github.com/Microsoft/BotBuilder-Azure
* ---------------------------------------------------------------------------------------- */

var tableName = 'botdata';
var azureTableClient = new botbuilder_azure.AzureTableClient(tableName, process.env['AzureWebJobsStorage']);
var tableStorage = new botbuilder_azure.AzureBotStorage({ gzipData: false }, azureTableClient);

// Create your bot with a function to receive messages from the user
var bot = new builder.UniversalBot(connector);
bot.set('storage', tableStorage);

// Make sure you add code to validate these fields
var luisAppId = process.env.LuisAppId;
var luisAPIKey = process.env.LuisAPIKey;
var luisAPIHostName = process.env.LuisAPIHostName || 'westus.api.cognitive.microsoft.com';

//const LuisModelUrl = 'https://' + luisAPIHostName + '/luis/v1/application?id=' + luisAppId + '&subscription-key=' + luisAPIKey;

const LuisModelUrl='https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/1876e8fe-8a75-472b-adb8-ee3feec9786c?subscription-key=2d2c5c9901e74377a1f43475205df3fd&staging=true&verbose=true&timezoneOffset=330&q=';


var recognizer = new builder.LuisRecognizer(LuisModelUrl);

//nilesh code waterfall start

// var intents = new builder.IntentDialog({ recognizers: [recognizer] })
// .matches('Greeting', [function(session){
//     session.send('HELLO, I am  Mumbai Bazar bot and I can help you with shopping clothes and shoes. HOW may I help you?');
//     session.beginDialog('askforgender');
// },
// function(session,results){
//     session.dialogData.gender=results.response;
//     session.beginDialog('askforitem');
// },
// function(session,results){
//         session.dialogData.item=results.response;
//         if((session.dialogData.gender.entity=="Women" || session.dialogData.gender.entity=="Men")&& session.dialogData.item.entity=="Clothes")
//         {
//             session.beginDialog('askforWear');
//             
//         }
//      },
//     function(session,results){
//         session.dialogData.Category=results.response;
//         
//        if(session.dialogData.gender.entity=="Women" && session.dialogData.Category.entity=="Top Wear")
//        {
//           session.beginDialog('WomensTopWear.Intent');
//        } 
//         if(session.dialogData.gender.entity=="Women" && session.dialogData.Category.entity=="Bottom Wear")
//        {
//            session.beginDialog('WomensBottomWear.Intent');
//        } 
//         if(session.dialogData.gender.entity=="Women" && session.dialogData.item.entity=="Shoes")
//        {
//            session.beginDialog('WomenShoes.Intent');
//        } 
//        if(session.dialogData.gender.entity=="Men" && session.dialogData.Category.entity=="Top Wear")
//        {
//            session.beginDialog('MensTopWear.Intent');
//        } 
//         if(session.dialogData.gender.entity=="Men" && session.dialogData.Category.entity=="Bottom Wear")
//        {
//            session.beginDialog('MensBottomWear.Intent');
//        } 
//         if(session.dialogData.gender.entity=="Men" && session.dialogData.item.entity=="Shoes")
//        {
//            session.beginDialog('MensShoes.Intent');
//        } 
//         
//     }
// ])
// 
// bot.dialog('askforgender',[
//  function(session){
//        builder.Prompts.choice(session,"Please select one gender", "Women|Men",{listStyle:builder.ListStyle.button }); 
//    },
//    function(session,result)
//    {
//        session.endDialogWithResult(result);
//    }
//  ]);
//  
//  bot.dialog('askforitem',[
//  function(session){
//        builder.Prompts.choice(session,"Please select one from below : ", "Clothes|Shoes",{listStyle:builder.ListStyle.button }); 
//    },
//    function(session,result)
//    {
//        session.endDialogWithResult(result);
//    }
//  ]);
//  
//  
//  
//  bot.dialog('askforWear',[
//  function(session){
//        builder.Prompts.choice(session,"Please select one category : ", "Top Wear|Bottom Wear",{listStyle:builder.ListStyle.button }); 
//    },
//    function(session,result)
//    {
//        session.endDialogWithResult(result);
//    }
//  ]);
// 
// 
// 
// 
// 
// 
// bot.dialog('WomenShoes.Intent', [(session, args) => {
//     var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Grey Shoes")
// .subtitle("Luxurious Cotton")
// .text("Price is 450 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'http://images.qvc.com/is/image/pic/fa/a280198.jpg?$aemshopbycategory$')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Blue Shoes")
// .subtitle("Leather Shoes")
// .text("Price is 500 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'https://i.pinimg.com/736x/e1/3c/e8/e13ce8c0004d16ca35ccd37e279333c2--women-oxford-shoes-flat-shoes-for-women.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Light Grey Sport")
// .subtitle("100% Soft")
// .text("Price is 600 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'https://i.pinimg.com/originals/1b/e2/64/1be2649e947686567ad971eef7c048c6.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
// }]).triggerAction({
//     matches: 'WomenShoes.Intent'
// });
// 
// 
// 
// bot.dialog('MensShoes.Intent', [(session, args) => {
//     var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Black Shoes")
// .subtitle("Luxurious Black Shoes")
// .text("Price is 450 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'https://d1qkaesl5we95l.cloudfront.net/media/catalog/product/cache/1/small_image/899x559/9df78eab33525d08d6e5fb8d27136e95/a/n/angus_5192-01_web.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Blue Shoes")
// .subtitle("Leather Shoes")
// .text("Price is 500 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'http://4.imimg.com/data4/DB/KD/MY-12309389/casual-mens-shoes-500x500.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Light Yellow Sport")
// .subtitle("100% Soft")
// .text("Price is 600 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'https://ae01.alicdn.com/kf/HTB1_oBnMFXXXXbWXpXXq6xXFXXXP/2017-New-Fashion-Autumn-Winter-Suede-Men-Shoes-Men-Canvas-Shoes-Leather-Casual-Breathable-Shoes-Flats.jpg_640x640.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
// }]).triggerAction({
//     matches: 'MensShoes.Intent'
// });
// 
// 
// bot.dialog('WomensBottomWear.Intent',[(session, args) => {
// var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Jeans Short")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://sslimages3.shoppersstop.com/sys-master/images/h3e/h44/9223665647646/200685893_9319_alt1.png_230Wx334H')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Blue Ghagra")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://sslimages4.shoppersstop.com/B8AC9759D45547D9AEF177F0DE13B7C8/img/B56F8E3BADDB448C8B1AB79B7C67E9C0/203100629_9308_B56F8E3BADDB448C8B1AB79B7C67E9C0.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Girls Stripe Skirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://sslimages4.shoppersstop.com/B8AC9759D45547D9AEF177F0DE13B7C8/img/897ECBAA1C1F4FB9842B78693C025F11/202802076_8394_897ECBAA1C1F4FB9842B78693C025F11.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
//    
// }]).triggerAction({
//     matches: 'WomensBottomWear.Intent'
// });
// 
// 
// bot.dialog('WomensTopWear.Intent',[(session, args) => {
// var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Classic White Top")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://www.ajio.com/medias/sys_master/root/hee/hb2/10093113049118/-473Wx593H-460054819-greymelange-MODEL.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Black Top")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'http://cdn.fcglcdn.com/brainbees/images/products/438x531/1697088a.webp')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Pink Top")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'http://cdn.fcglcdn.com/brainbees/images/products/438x531/1831821a.webp')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
// }]).triggerAction({
//     matches: 'WomensTopWear.Intent'
// });
// 
// 
// 
// 
// bot.dialog('MensBottomWear.Intent',[(session, args) => {
// var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Jeans Short")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 450 Rs and carried in sizes (S, M, L)")
// .images([builder.CardImage.create(session,
// 'https://img1.exportersindia.com/product_images/bc-small/dir_124/3693001/mens-bottom-wear-2346122.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Cotton Short")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://images-eu.ssl-images-amazon.com/images/I/81o5ARcpfOL._SY355_.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Cotton full pant")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfQnC47tjXhbOtSfasAkX1onlS30zibjSx0nkVyRUCACnO-YHU')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
//    
// }]).triggerAction({
//     matches: 'MensBottomWear.Intent'
// });
// 
// 
// bot.dialog('MensTopWear.Intent',[(session, args) => {
// var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.ThumbnailCard(session)
// .title("Classic Grey T-Shirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://assets.myntassets.com/h_240,q_90,w_180/v1/assets/images/1997244/2017/9/6/11504686918599-Roadster-Men-Grey-Melange-Printed-Round-Neck-T-shirt-701504686918389-1_mini.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic White Shirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'http://assets.myntassets.com/v1/image/style/properties/617555/INVICTUS-Men-White-Slim-Fit-Formal-Shirt_2_71290ba4ff1933abe3a28d0bde1df472.jpg')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ]),
// new builder.ThumbnailCard(session)
// .title("Classic Pink T-Shirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM904VCSfxkREX00LYg7lOMEEBziauXgFMJJX9Dqfv-CWmaKU5')])
// .buttons([
// builder.CardAction.imBack(session, "Buy", "Buy")
// ])
// ]);
// session.send(msg)
// }]).triggerAction({
//     matches: 'MensTopWear.Intent'
// });
// 
// 
// 
// bot.dialog('/', intents);  


////nilesh code waterfall end



//working code shopping bazar Nilesh Start

bot.recognizer(recognizer); 
bot.dialog('Welcome.Intent', (session, args) => {
    var intent = args.intent;
    session.sendTyping();
    //session.send(confirmation(session);
    
    builder.Prompts.choice(session, "HELLO, I am  Mumbai Bazar bot and I can help you with shopping clothes and shoes. HOW may I help you?. <br/>Please choose anyone of the following", "Women Item|Men Item", { listStyle: builder.ListStyle.button });
    session.endDialog(); 
}).triggerAction({
    matches: 'Welcome.Intent'
});


bot.dialog('Women.Intent', [(session, args) => {
    var intent = args.intent;
    session.sendTyping();
    builder.Prompts.choice(session, "Please choose anyone of the following", "Womens Clothes|Womens Shoes", { listStyle:builder.ListStyle.button});
    session.endDialog(); 
}]).triggerAction({
    matches: 'Women.Intent'
});


bot.dialog('WomenClothes.Intent', [(session, args) => {
    var intent = args.intent;
    session.sendTyping();
    builder.Prompts.choice(session, "Please choose anyone of the following", "Womens Top Wear|Womens Bottom Wear", { listStyle:builder.ListStyle.button});
    session.endDialog(); 
}]).triggerAction({
    matches: 'WomenClothes.Intent'
});


bot.dialog('WomenShoes.Intent', [(session, args) => {
    var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Grey Shoes")
.subtitle("Luxurious Cotton")
.text("Price is 450 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'http://images.qvc.com/is/image/pic/fa/a280198.jpg?$aemshopbycategory$')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Blue Shoes")
.subtitle("Leather Shoes")
.text("Price is 500 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'https://i.pinimg.com/736x/e1/3c/e8/e13ce8c0004d16ca35ccd37e279333c2--women-oxford-shoes-flat-shoes-for-women.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Light Grey Sport")
.subtitle("100% Soft")
.text("Price is 600 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'https://i.pinimg.com/originals/1b/e2/64/1be2649e947686567ad971eef7c048c6.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg).endDialog();
}]).triggerAction({
    matches: 'WomenShoes.Intent'
});



bot.dialog('MensShoes.Intent', [(session, args) => {
    var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Black Shoes")
.subtitle("Luxurious Black Shoes")
.text("Price is 450 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'https://d1qkaesl5we95l.cloudfront.net/media/catalog/product/cache/1/small_image/899x559/9df78eab33525d08d6e5fb8d27136e95/a/n/angus_5192-01_web.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Blue Shoes")
.subtitle("Leather Shoes")
.text("Price is 500 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'http://4.imimg.com/data4/DB/KD/MY-12309389/casual-mens-shoes-500x500.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Light Yellow Sport")
.subtitle("100% Soft")
.text("Price is 600 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'https://ae01.alicdn.com/kf/HTB1_oBnMFXXXXbWXpXXq6xXFXXXP/2017-New-Fashion-Autumn-Winter-Suede-Men-Shoes-Men-Canvas-Shoes-Leather-Casual-Breathable-Shoes-Flats.jpg_640x640.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg).endDialog();
}]).triggerAction({
    matches: 'MensShoes.Intent'
});





bot.dialog('Men.Intent', (session, args) => {
    var intent = args.intent;
    session.sendTyping();
    builder.Prompts.choice(session, "Please choose anyone of the following", "Mens Clothes|Mens Shoes", { listStyle: builder.ListStyle.button });
    session.endDialog(); 
}).triggerAction({
    matches: 'Men.Intent'
});


bot.dialog('MenClothes.Intent', [(session, args) => {
    var intent = args.intent;
    session.sendTyping();
    builder.Prompts.choice(session, "Please choose anyone of the following", "Mens Top Wear|Mens Bottom Wear", { listStyle:builder.ListStyle.button});
    session.endDialog(); 
}]).triggerAction({
    matches: 'MenClothes.Intent'
});


bot.dialog('Buy.Intent', [(session, args) => {
    var intent = args.intent;
    session.sendTyping();
    builder.Prompts.choice(session, "Please place your order", "Place Order", { listStyle:builder.ListStyle.button});
    session.endDialog(); 
}]).triggerAction({
    matches: 'Buy.Intent'
});


bot.dialog('PlaceOrder.Intent', [(session, args) => {
            builder.Prompts.text(session, "What's your email id");
 }, (session, results) => {
    console.log("Inside");
     session.userData.email=results;
    
     var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    
     console.log(session.userData.email.response);
     
    if(!filter.test(session.userData.email.response))
    {
        console.log("InsideInvalid");
        session.replaceDialog('PlaceOrder.Intent',{ reprompt: true });
    }
    else{
        console.log("Insidevalid");
        var msg = new builder.Message(session);
        //msg.attachmentLayout(builder.AttachmentLayout.ThumbnailCard)
        msg.attachments([
        new builder.HeroCard(session)
            .title("Order Confirmation")
            .text("Order is confirmed and confirmation mail has been sent to your email id" + results.response)
            .images([builder.CardImage.create(session, 'http://emitalia.co.uk/pages/wp-content/uploads/2013/06/Order-confirmed.jpg')])
            
        ])
        
        session.send(msg);
    } 
   
},
function(session,results){
     session.endDialog(); 
}]).triggerAction({
    matches: 'PlaceOrder.Intent'
});


bot.dialog('WomensBottomWear.Intent',[(session, args) => {
var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Jeans Short")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://sslimages3.shoppersstop.com/sys-master/images/h3e/h44/9223665647646/200685893_9319_alt1.png_230Wx334H')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Blue Ghagra")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://sslimages4.shoppersstop.com/B8AC9759D45547D9AEF177F0DE13B7C8/img/B56F8E3BADDB448C8B1AB79B7C67E9C0/203100629_9308_B56F8E3BADDB448C8B1AB79B7C67E9C0.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Girls Stripe Skirt")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://sslimages4.shoppersstop.com/B8AC9759D45547D9AEF177F0DE13B7C8/img/897ECBAA1C1F4FB9842B78693C025F11/202802076_8394_897ECBAA1C1F4FB9842B78693C025F11.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg).endDialog();
   
}]).triggerAction({
    matches: 'WomensBottomWear.Intent'
});


bot.dialog('WomensTopWear.Intent',[(session, args) => {
var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Classic White Top")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://www.ajio.com/medias/sys_master/root/hee/hb2/10093113049118/-473Wx593H-460054819-greymelange-MODEL.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Black Top")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'http://cdn.fcglcdn.com/brainbees/images/products/438x531/1697088a.webp')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Pink Top")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'http://cdn.fcglcdn.com/brainbees/images/products/438x531/1831821a.webp')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg).endDialog();
}]).triggerAction({
    matches: 'WomensTopWear.Intent'
});




bot.dialog('MensBottomWear.Intent',[(session, args) => {
var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Jeans Short")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 450 Rs and carried in sizes (S, M, L)")
.images([builder.CardImage.create(session,
'https://img1.exportersindia.com/product_images/bc-small/dir_124/3693001/mens-bottom-wear-2346122.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Cotton Short")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://images-eu.ssl-images-amazon.com/images/I/81o5ARcpfOL._SY355_.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Cotton full pant")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTfQnC47tjXhbOtSfasAkX1onlS30zibjSx0nkVyRUCACnO-YHU')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg).endDialog();
   
}]).triggerAction({
    matches: 'MensBottomWear.Intent'
});


bot.dialog('MensTopWear.Intent',[(session, args) => {
var msg = new builder.Message(session);
msg.attachmentLayout(builder.AttachmentLayout.carousel)
msg.attachments([
new builder.ThumbnailCard(session)
.title("Classic Grey T-Shirt")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 450 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://assets.myntassets.com/h_240,q_90,w_180/v1/assets/images/1997244/2017/9/6/11504686918599-Roadster-Men-Grey-Melange-Printed-Round-Neck-T-shirt-701504686918389-1_mini.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic White Shirt")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 500 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'http://assets.myntassets.com/v1/image/style/properties/617555/INVICTUS-Men-White-Slim-Fit-Formal-Shirt_2_71290ba4ff1933abe3a28d0bde1df472.jpg')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
]),
new builder.ThumbnailCard(session)
.title("Classic Pink T-Shirt")
.subtitle("100% Soft and Luxurious Cotton")
.text("Price is 600 Rs and carried in sizes (S, M, L, and XL)")
.images([builder.CardImage.create(session,
'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM904VCSfxkREX00LYg7lOMEEBziauXgFMJJX9Dqfv-CWmaKU5')])
.buttons([
builder.CardAction.imBack(session, "Buy", "Buy")
])
]);
session.send(msg)
}]).triggerAction({
    matches: 'MensTopWear.Intent'
});

function createAnimationCard(session) {
    return new builder.AnimationCard(session)
        .title('Microsoft Bot Framework')
        .subtitle('Animation Card')
        .image(builder.CardImage.create(session, 'https://docs.microsoft.com/en-us/bot-framework/media/how-it-works/architecture-resize.png'))
        .media([
            { url: 'http://i.giphy.com/Ki55RUbOV5njy.gif' }
        ]);
}

//Working code for shopping demo Nilesh End



//commented by nilesh start
// Main dialog with LUIS
// var recognizer = new builder.LuisRecognizer(LuisModelUrl);
// 
// bot.recognizer(recognizer); 
// // bot.dialog('Welcome.Intent', (session, args) => {
// //     session.sendTyping();
// //     builder.Prompts.choice(session,"HELLO, I am  Mumbai Bazar bot and I can help you with shopping clothes and shoes. HOW may I help you?", "Women|Men",
// //     {listStyle:builder.ListStyle.button }); 
// //     session.endDialog(); 
// // }).triggerAction({
// //     matches: 'Welcome.Intent'
// // });
// 
// 
// var inMemoryStorage = new builder.MemoryBotStorage();
// // This is a dinner reservation bot that uses a waterfall technique to prompt users for input.
// var bot = new builder.UniversalBot(connector, [
// function (session) {
// builder.Prompts.choice(session,"HELLO, I am  Mumbai Bazar bot and I can help you with shopping clothes and shoes. HOW may I help you?", "Women|Men",
// {listStyle:builder.ListStyle.button }); 
// },
// function (session, results) {
// session.dialogData.userselectedWM = results.response;
// builder.Prompts.choice(session,"Choose one from following", "Clothes|Shoes",
// {listStyle:builder.ListStyle.button }); 
// },
// function (session, results) {
// session.dialogData.userselectedCS = results.response;
// builder.Prompts.choice(session,"Choose one from following", "Top Wear|Bottom Wear",
// {listStyle:builder.ListStyle.button }); 
// },
// function (session, results) {
// session.dialogData.userselectedTB = results.response;
// 
// var msg = new builder.Message(session);
// msg.attachmentLayout(builder.AttachmentLayout.carousel)
// msg.attachments([
// new builder.HeroCard(session)
// .title("Classic White T-Shirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is $25 and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'http://petersapparel.parseapp.com/img/whiteshirt.png')])
// .buttons([
// builder.CardAction.imBack(session, "buy classic white t-shirt", "Buy")
// ]),
// new builder.HeroCard(session)
// .title("Classic Gray T-Shirt")
// .subtitle("100% Soft and Luxurious Cotton")
// .text("Price is $25 and carried in sizes (S, M, L, and XL)")
// .images([builder.CardImage.create(session,
// 'http://petersapparel.parseapp.com/img/grayshirt.png')])
// .buttons([
// builder.CardAction.imBack(session, "buy classic gray t-shirt", "Buy")
// ])
// ]);
// session.send(msg).endDialog();
// 
// }
// ]).set('storage', inMemoryStorage); // Register in-memory storage
//commented by nilesh end