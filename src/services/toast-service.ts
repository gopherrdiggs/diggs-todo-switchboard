class ToastController {

  toastCtrl: HTMLIonToastControllerElement;

  constructor() {
    this.toastCtrl = document.querySelector('ion-toast-controller');
  }

  getController() {
    return this.toastCtrl;
  }

  async showSuccessToast(
    message: string = 'Operation succeeded', 
    position: 'bottom' | 'top' | 'middle' = 'bottom', 
    duration: number = 1000) {

    let toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      color: 'success'
    });

    return await toast.present();
  }

  async showFailureToast(
    message: string = 'Operation failed', 
    position: 'bottom' | 'top' | 'middle' = 'bottom', 
    duration: number = 3000) {

    let toast = await this.toastCtrl.create({
      message: message,
      duration: duration,
      position: position,
      color: 'danger'
    });

    return await toast.present();
  }

}

export const ToastService = new ToastController();