//variavel para requerir os módulos npm
const electron = require('electron');
const url = require('url');
const path = require('path');

const{app, BrowserWindow, Menu, ipcMain} = electron;
//altera para produção
//process.env.NODE_ENV='production'

let mainWindow;
let AddWindow;

//espera o app ficar pronto
app.on('ready', function(){
  //cria a nova janela
  mainWindow = new BrowserWindow(
    {
      webPreferences: {
               nodeIntegration: true
      }
    });
  //carrega o html na janela
  mainWindow.loadURL(url.format({
    //carrega o diretorio no loadURL
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol:'file:',
    slashes: true
  }));
//fecha o app quando fechar as janelas
mainWindow.on('closed', function(){
  app.quit();
  }
);

  //constroi o menu a partir do mainMenuTemplate( Referente ao menu acima da aplicação)
  //variavel do menu
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  //inserir o Menu
  Menu.setApplicationMenu(mainMenu);

});

//Cuida da função de adicionar a segunda nova janela
function createAddWindow(){
  //cria a nova janela
  addWindow = new BrowserWindow({
    width: 300,
    height: 200,
    title:'Adicionar Item a lista',
    //conseguir trabalhar com os dados na página html
    webPreferences: {
            nodeIntegration: true
        }
  });
  //carrega o html na janela
  addWindow.loadURL(url.format({
    //carrega o diretorio no loadURL
    pathname: path.join(__dirname, 'addWindow.html'),
    protocol:'file:',
    slashes: true
  }));
  //garbage collection handle
  addWindow.on('closed', function(){
    addWindow = null;
  });
}
//pegar o item:add
ipcMain.on('item:add',function (e,item){
  console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})
//Cria o template do menu
//variavel do menu
const mainMenuTemplate = [
  {
    label: 'File',
    submenu:[
      {
        label: 'Adicionar item',
        click(){
          createAddWindow();
        }
      },
      {
        label: 'Limpa Tela',
        click(){
          mainWindow.webContents.send('item:clear');
        }
      },
      {
        label: 'Sair',
        //adiciona um atalho para o botão e verifica qual plataforma ta utilizado
        accelerator: process.platform == 'darwin' ? 'Commando+Q' :
        'Ctrl+Q',
        click(){
          //evento de click para fechar
          app.quit();
        }
      }
    ]
  }
];

//ajusta a visualização no mac e insere um objeto vazio
if (process.platform == 'darwin'){
  mainMenuTemplate.unshift({});
}

//Adciona as ferramente de desenvolvedor caso não esteja em produçãoptimize
if(process.env.NODE_ENV !== 'production'){
  mainMenuTemplate.push({
    label: 'DevTools',
    submenu:[
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Commando+I' :
        'Ctrl+I',
        click(item, focusedWindow){
          focusedWindow.toggleDevTools();
        }
      },
      {
        role: 'reload'
      }
    ]
  });
}
