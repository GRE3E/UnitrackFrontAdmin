import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { EnvioCorreoService } from '../services/envio-correo.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
})
export class ContrasenaPage implements OnInit {
  newPassword: string = '';
  isSubmitting = false; // Para prevenir envío doble
  email: string = '';
  code: string = '';

  constructor(
    private userService: EnvioCorreoService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  resetPassword() {
    if (this.newPassword.length < 6) {
      this.presentToast('La contraseña debe tener al menos 6 caracteres');
      this.isSubmitting = false;
      return;
    }
    if (this.newPassword.length > 50) {
      this.presentToast('La contraseña no debe superar 50 caracteres');
      this.isSubmitting = false;
      return;
    }

    if (!this.email || !this.code) {
      this.presentToast('Faltan parámetros para restablecer la contraseña.');
      this.isSubmitting = false;
      return;
    }

    this.userService
      .resetPassword(this.email, this.code, this.newPassword)
      .subscribe(
        (response) => {
          this.presentToast('Contraseña actualizada con éxito', 'success');
          this.navCtrl.navigateRoot('/login');
          this.isSubmitting = false;
        },
        (error) => {
          this.presentToast(
            error.message || 'Error al actualizar la contraseña'
          );
          this.isSubmitting = false;
        }
      );
  }

  cancelarProceso() {
    localStorage.removeItem('reset_code');
    this.navCtrl.navigateRoot('/login');
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
      if (!this.email || !this.code) {
        this.presentToast('Faltan parámetros para restablecer la contraseña.');
        this.navCtrl.navigateRoot('/login');
      }
    });
  }
}
