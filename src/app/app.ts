import {AfterViewChecked, AfterViewInit, Component, HostListener, OnInit} from '@angular/core';
import {Canvas, Circle, FabricObject, Rect, Textbox} from 'fabric';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule
  ],
  templateUrl: './app.html'
})
export class App implements AfterViewInit {
  protected logs: string = '';
  public selectedObjects: FabricObject[] = [];
  private canvas!: Canvas;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'd') {
      this.log(`Deleting selected objects!`);
      this.canvas.remove(...this.canvas.getActiveObjects());
      this.canvas.discardActiveObject();
      this.canvas.requestRenderAll();
    }
  }

  public constructor() {
  }

  public ngAfterViewInit(): void {
    // Initialize canvas
    this.canvas = new Canvas('fabric-canvas');

    // Setup event callbacks
    this.canvas.on('selection:created', (event) => {
      this.log(`Selection created: ${event.selected}`);
      this.selectedObjects = this.canvas.getActiveObjects();
    });
    this.canvas.on('selection:updated', (event) => {
      this.log(`Selection updated: ${event.selected}`);
      this.selectedObjects = this.canvas.getActiveObjects();
    });
    this.canvas.on('selection:cleared', (event) => {
      this.log(`Selection cleared!`);
      this.selectedObjects = [];
    });

    this.addShape('circle');
    this.addShape('rectangle');
    this.addShape('text')
  }

  public addShape(shape: 'circle' | 'rectangle' | 'text', log = true): void {
    const properties = {
      left: Math.random() * 600,
      top: Math.random() * 300
    };
    let newObject: Circle | Rect | Textbox;
    if (shape === 'circle') {
      newObject = new Circle({...properties, radius: Math.random() * 100, fill: 'green'})
    } else if (shape === 'rectangle') {
      newObject = new Rect({...properties, width: Math.random() * 120, height: Math.random() * 80, stroke: 'red'});
    } else {
      newObject = new Textbox('Hello World', {...properties, width: 100, height: 20, fontSize: 24, stroke: 'blue'});
    }
    if (this.canvas.getObjects().length >= 3) {
      this.log(`Added new fabricJs object: ${shape}`);
    }
    this.canvas.add(newObject)
  }

  public changeColor(): void {
    this.canvas.getActiveObjects().forEach(o => {
      o.set({fill: 'yellow'})
    });
    this.canvas.requestRenderAll();
  }

  private log(message: string): void {
    this.logs = message + '\n' + this.logs;
  }
}
