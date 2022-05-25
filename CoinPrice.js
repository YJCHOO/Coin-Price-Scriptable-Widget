const HEADER = "⚛️ Ecosystem";
const COINS = ["cosmos", "osmosis", "juno-network"];

const params = args.widgetParameter ? args.widgetParameter.split(",") : [];
const isDarkTheme = params?.[0] === 'dark';

async function createWidget() {
  
  let listWidget = new ListWidget();
  
  if (isDarkTheme) {
    listWidget.backgroundColor = new Color('#1C1C1E');; 
  }
  listWidget.setPadding(2, 2, 2, 2);
  
  
  const headerStack = listWidget.addStack();
  headerStack.setPadding(0, 0, 20, 0);
  let headerText = headerStack.addText(HEADER);
  headerText.font = Font.lightSystemFont(16);
  if (isDarkTheme) {
    headerText.textColor = new Color('#FFFFFF');
  }


  for(let coin of COINS) {

    let coinInfo = await getCoinInfo(coin);
    let imageRequest = new Request(coinInfo[0].image);
    let coinImage = await imageRequest.loadImage();

    addStack(listWidget, coinInfo, coinImage);
  }
  return listWidget;
}

async function getCoinInfo(coinId) {
  let url = `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinId}`;
  
  let request = new Request(url);
  let response = await request.loadJSON();
  
  return response;
}

function addStack(listWidget, coinInfo, coinImage) {
  let rowStack = listWidget.addStack();
  rowStack.setPadding(0, 0, 16, 0);
  rowStack.layoutHorizontally();

  let imageStack = rowStack.addStack();
  imageStack.setPadding(0, 0, 0, 10);
  let imageNode = imageStack.addImage(coinImage);
  imageNode.imageSize = new Size(20, 20);
  imageNode.leftAlignImage();

  let coinSymbol = coinInfo[0].symbol.toUpperCase().padEnd(6, " ");

  let symbolStack = rowStack.addStack();
  symbolStack.size = new Size(50, 20);
  let symbolText = symbolStack.addText(coinSymbol);
  symbolText.font = Font.mediumSystemFont(12);


  let coinPrice = String(coinInfo[0].current_price);
  
  let priceStack = rowStack.addStack();
  let priceText = priceStack.addText(`$${coinPrice}`);
  priceText.font = Font.mediumSystemFont(12);
  
  let priceTextColor = coinInfo[0].price_change_24h > 0? '#4AA956' : '#D22E2E';
    priceText.textColor = new Color(priceTextColor);
}


let widget = await createWidget();

if (config.runsInWidget) {
  Script.setWidget(widget);
} else {
  widget.presentSmall();
}


Script.complete();
