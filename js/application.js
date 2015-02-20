// Wait till the browser is ready to render the game (avoids glitches)
var driver = new Driver2048();
window.requestAnimationFrame(function () {
  driver.setGameManager(new GameManager(4, KeyboardInputManager, HTMLActuator, LocalStorageManager));
});
