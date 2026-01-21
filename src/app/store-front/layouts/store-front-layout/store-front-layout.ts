import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontStoreNavbar } from "../../components/front-store-navbar/front-store-navbar";

@Component({
  selector: 'app-store-front-layout',
  imports: [RouterOutlet, FrontStoreNavbar],
  templateUrl: './store-front-layout.html',
})
export class StoreFrontLayout { }
