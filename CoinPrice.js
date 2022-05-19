const HEADER = "⚛️Cosmos Ecosystem⚛️";
const COINS = ["cosmos", "osmosis", "secret"];

async function createWidget() {
  let listWidget = new ListWidget();
  listWidget.backgroundColor = new Color("#000000");


  let heading = listWidget.addText(HEADER);
  heading.centerAlignText();
  heading.font = Font.lightSystemFont(25);
  heading.textColor = new Color("#ffffff");

  listWidget.addSpacer(15);

  for(let i = 0; i < COINS.length; i++) {
    let coinInfo = getCoinInfo(COINS[i]);

    console.log("coinInfo: " + coinInfo);
    
    let imageRequest = new Request(coinInfo[0].image);
    let coinImage = await imageRequest.loadImage();

    addStack(listWidget, coinInfo, coinImage);
    listWidget.addSpacer(5);
  }
  return listWidget;
}

async function getCoinInfo(coinId) {
  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`;
  let request = new Request(url);
  console.log("request: " + request);
  let response = await request.loadJSON();
  console.log("response: " + response)
  return response;
}

function addStack(listWidget, coinInfo, coinImage) {
  let rowStack = listWidget.addStack();
  rowStack.setPadding(0, 0, 14, 0);
  rowStack.layoutHorizontally();

  let imageStack = rowStack.addStack();
  imageStack.setPadding(0, 0, 0, 10);
  let imageNode = imageStack.addImage(coinImage);
  imageNode.imageSize = new Size(20, 20);
  imageNode.leftAlignImage();

  let symbolStack = rowStack.addStack();
  let symbolText = symbolStack.addText(coinInfo[0].symbol);
  symbolText.font = Font.mediumSystemFont(16);

  let priceStack = rowStack.addStack();
  let priceText = priceStack.addText(coinInfo[0].current_price)
  priceText.font = Font.mediumSystemFont(16);
}


let widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentMedium();
}


Script.complete();


