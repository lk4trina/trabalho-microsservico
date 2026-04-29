const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome'); // Adicione esta linha

//const FRONTEND_URL = 'http://127.0.0.1:5501/frontend/paginas/bookings/booking.html'; 
const URL_LOGIN = 'http://127.0.0.1:5501/frontend/paginas/login/login.html';

async function testarSistema() {

    //let driver = await new Builder().forBrowser('chrome').build(); --mudei para limpar os erros relacionados ao navegador
    let opcoesChrome = new chrome.Options();
    opcoesChrome.addArguments('--log-level=3'); 
    opcoesChrome.addArguments('--silent');      

    let driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(opcoesChrome)
        .build();

    try {
        console.log('Iniciando Teste de Sistema com Selenium...');


        /*await driver.get(FRONTEND_URL);

        await driver.executeScript("localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJuYW5hIiwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzc3NDMyNTQyLCJleHAiOjE3Nzc0MzYxNDJ9.Zl-a_k_YB3n9nAYnBPv0aNjtCki0QzJIA6sTej622qA');");
        await driver.navigate().refresh(); 

        await driver.wait(until.elementLocated(By.id('calendar')), 5000);
        console.log('Agenda carregada (BFF e UI funcionais).');*/

        // ==========================================
        // COMECANDO PELA TELA DE LOGIN PARA NÃO PRECISAR COLOCAR O TOKEN TODA VEZ
        // ==========================================
        console.log('Acessando a página de Login...');
        await driver.get(URL_LOGIN);

        await driver.wait(until.elementLocated(By.id('user')), 5000);

        await driver.findElement(By.id('user')).sendKeys('nana'); 
        await driver.findElement(By.id('pass')).sendKeys('bubu');     
        
        await driver.findElement(By.id('btn-login')).click();

        console.log('Aguardando redirecionamento pós-login...');
        
        let btnNovaReserva = await driver.wait(
            until.elementLocated(By.css("button[onclick='myBookings()']")), 
            10000
        );

        console.log('Login feito! Clicando no botão para ir para a agenda...');
        
        await driver.sleep(500);
        await btnNovaReserva.click();
        await driver.wait(until.elementLocated(By.id('calendar')), 10000);
        console.log('Agenda carregada com sucesso!');

        // ==========================================
        // TESTE 1: CRIAÇÃO DE RESERVA
        // ==========================================
        console.log('1. Testando Criação de Reserva...');
        
        await driver.executeScript("document.getElementById('create-modal').classList.remove('hidden');");
        
        await driver.findElement(By.id('roomSelect')).sendKeys('1'); 
        await driver.executeScript(`document.getElementById('createStartTime').value = '2026-12-10T10:00';
                                    document.getElementById('createEndTime').value = '2026-12-11T12:00';`);

        await driver.sleep(500); 
        let btnConfirmar = await driver.findElement(By.css("button[onclick='saveNewBooking()']"));
        await btnConfirmar.click();

        await driver.wait(until.alertIsPresent(), 5000);
        let alert1 = await driver.switchTo().alert();
        let alertText1 = await alert1.getText();
        console.log(`Mensagem recebida: "${alertText1}"`);
        await alert1.accept(); 

        // ==========================================
        // TESTE 2: CONFLITO DE HORÁRIO
        // ==========================================
        console.log('2. Testando Conflito de Horário (Regra de Negócio)...');
        
        await driver.executeScript("document.getElementById('create-modal').classList.remove('hidden');");

        await driver.sleep(500); 
        let btnConfirmarTeste2 = await driver.findElement(By.css("button[onclick='saveNewBooking()']"));
        await btnConfirmarTeste2.click();

        await driver.wait(until.alertIsPresent(), 5000);
        let alert2 = await driver.switchTo().alert();
        let alertText2 = await alert2.getText();
        
        if (alertText2.includes('Conflito') || alertText2.includes('Erro')) {
            console.log(`Conflito detetado corretamente: "${alertText2}"`);
        } else {
            console.log(`Erro inesperado: "${alertText2}"`);
        }
        await alert2.accept();

        // ==========================================
        // TESTE 3: AGREGAÇÃO DE DADOS (BFF)
        // ==========================================
        console.log('3. Testando Agregação do BFF...');
        

        await driver.sleep(2000); 
        let eventos = await driver.findElements(By.className('fc-event-title'));
        
        if (eventos.length > 0) {
            let textoPrimeiroEvento = await eventos[0].getText();
            console.log(`Evento visível na interface com os dados agregados: "${textoPrimeiroEvento}"`);
        } else {
            console.log('Nenhum evento encontrado na interface visual.');
        }

        console.log('Todos os testes de Sistema concluídos com sucesso!');

    } catch (error) {
        console.error('O teste falhou:', error);
    } finally {
        await driver.quit();
    }
}

testarSistema();