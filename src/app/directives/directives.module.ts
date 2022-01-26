import { NgModule } from "@angular/core";
import { SelectDirective } from "./select.directive";


const directives = [
  SelectDirective
];

@NgModule({
  imports: [],
  exports: [...directives],
  declarations: [...directives],
})
export class DirectivessModule { }
