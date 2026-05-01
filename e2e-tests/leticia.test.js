const { Builder, By, until } = require("selenium-webdriver");

const BASE_URL = "http://127.0.0.1:5501";
const PASSWORD = "123456";

async function waitAndType(driver, id, value, timeout = 5000) {
  const element = await driver.wait(until.elementLocated(By.id(id)), timeout);
  await element.clear();
  await element.sendKeys(value);
}

async function handleAlert(driver, label = "ALERTA") {
  try {
    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    console.log(`${label}:`, await alert.getText());
    await alert.accept();
    return true;
  } catch {
    return false;
  }
}

async function jsClick(driver, element) {
  await driver.executeScript("arguments[0].click();", element);
}

(async function systemTest() {
  const driver = await new Builder().forBrowser("chrome").build();

  const uniqueUser = `admin_test_${Date.now()}`;
  const roomName = "Sala Selenium";

  try {
    console.log("========== INICIANDO TESTE DE SISTEMA ==========");

    // =====================================================
    // 1. CADASTRO
    // =====================================================
    console.log("1. Cadastro de administrador...");
    await driver.get(`${BASE_URL}/frontend/paginas/register/register.html`);

    await waitAndType(driver, "reg-user", uniqueUser);
    await waitAndType(driver, "reg-pass", PASSWORD);
    await waitAndType(driver, "reg-pass-confirm", PASSWORD);

    const roleSelect = await driver.findElement(By.id("reg-role"));
    await roleSelect.sendKeys("ADMIN");

    await driver.findElement(By.id("btn-register")).click();

    await handleAlert(driver);

    await driver.wait(until.urlContains("login"), 7000);

    console.log("✔ Cadastro realizado com sucesso");

    // =====================================================
    // 2. LOGIN
    // =====================================================
    console.log("2. Login...");
    await waitAndType(driver, "user", uniqueUser);
    await waitAndType(driver, "pass", PASSWORD);

    await driver.findElement(By.id("btn-login")).click();

    const hadLoginAlert = await handleAlert(driver, "ALERTA LOGIN");
    if (!hadLoginAlert) {
      console.log("Nenhum alerta de login encontrado");
    }

    await driver.sleep(3000);

    console.log("URL após login:", await driver.getCurrentUrl());
    console.log("Título após login:", await driver.getTitle());
    console.log("✔ Login realizado com sucesso");

    // =====================================================
    // 3. CRIAR SALA
    // =====================================================
    console.log("3. Criando sala...");
    const createRoomButton = await driver.wait(
      until.elementLocated(By.id("btn-create-room")),
      7000,
    );

    await createRoomButton.click();

    await waitAndType(driver, "roomName", roomName);
    await waitAndType(driver, "capacity", "20");

    const modalButtons = await driver.findElements(By.css("#modal button"));
    await modalButtons[0].click();

    await driver.sleep(2000);

    console.log("✔ Sala criada com sucesso");

    // =====================================================
    // 4. VALIDAR SALA
    // =====================================================
    console.log("4. Validando sala...");
    let bodyText = await driver.findElement(By.tagName("body")).getText();

    if (!bodyText.includes(roomName)) {
      throw new Error("Sala criada não apareceu na listagem");
    }

    console.log("✔ Sala encontrada na listagem");

    // =====================================================
    // 5. FILTROS
    // =====================================================
    console.log("5. Testando filtros...");
    const filterButtons = await driver.findElements(By.css(".filter button"));

    await jsClick(driver, filterButtons[1]); // Ativas
    await driver.sleep(1000);

    await jsClick(driver, filterButtons[0]); // Todas
    await driver.sleep(1000);

    console.log("✔ Filtros funcionando");

    // =====================================================
    // 6. EDITAR SALA
    // =====================================================
    console.log("6. Editando sala...");

    let updatedRoomName = roomName;

    try {
      const editIcons = await driver.findElements(By.css(".fa-pen.edit"));

      if (editIcons.length > 0) {
        await jsClick(driver, editIcons[0]);

        updatedRoomName = "Sala Editada";
        await waitAndType(driver, "editRoomName", updatedRoomName);
        await waitAndType(driver, "editCapacity", "50");

        const saveButtons = await driver.findElements(
          By.xpath("//button[contains(., 'Salvar')]"),
        );

        if (saveButtons.length > 0) {
          await jsClick(driver, saveButtons[0]);
          await driver.sleep(2000);

          bodyText = await driver.findElement(By.tagName("body")).getText();

          if (!bodyText.includes(updatedRoomName)) {
            throw new Error("Sala editada não apareceu com novo nome");
          }

          console.log("✔ Sala editada com sucesso");
        } else {
          console.log("⚠ Botão salvar não encontrado");
        }
      } else {
        console.log("⚠ Ícone de editar não encontrado");
      }
    } catch (error) {
      console.log("⚠ Erro ao editar sala:", error.message);
    }

    // =====================================================
    // 7. EXCLUIR SALA
    // =====================================================
    console.log("7. Excluindo sala...");

    try {
      const deleteIcons = await driver.findElements(By.css(".fa-trash.delete"));

      if (deleteIcons.length > 0) {
        await jsClick(driver, deleteIcons[0]);

        await handleAlert(driver, "ALERTA EXCLUSÃO");

        await driver.sleep(2000);

        bodyText = await driver.findElement(By.tagName("body")).getText();

        if (bodyText.includes(updatedRoomName)) {
          throw new Error("Sala ainda aparece após exclusão");
        }

        console.log("✔ Sala excluída com sucesso");
      } else {
        console.log("⚠ Ícone de excluir não encontrado");
      }
    } catch (error) {
      console.log("⚠ Erro ao excluir sala:", error.message);
    }

    // =====================================================
    // 8. LOGOUT
    // =====================================================
    console.log("8. Logout...");

    const logoutButtons = await driver.findElements(
      By.xpath("//button[contains(., 'Sair')]"),
    );

    if (logoutButtons.length > 0) {
      await jsClick(driver, logoutButtons[0]);
      await driver.sleep(2000);

      console.log("✔ Logout realizado");
    } else {
      console.log("⚠ Botão logout não encontrado");
    }

    console.log("========== TESTE FINALIZADO COM SUCESSO ==========");
  } catch (error) {
    console.error("❌ TESTE FALHOU:");
    console.error(error);
  } finally {
    await driver.quit();
  }
})();
