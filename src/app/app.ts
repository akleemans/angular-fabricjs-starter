import {AfterViewInit, Component, HostListener} from '@angular/core';
import {Canvas, Circle, controlsUtils, FabricObject, Polygon, Rect, Textbox} from 'fabric';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: 'app.scss'
})
export class App implements AfterViewInit {
  protected logs: string = '';
  protected selectedObjects: FabricObject[] = [];
  protected activeColor = 'yellow';
  protected isEditingPolygon = false;
  protected isDrawingNewPolygon = false;
  protected isPolygonSelected = false;
  private canvas!: Canvas;

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'd') {
      this.deleteObjects();
    }
  }

  public ngAfterViewInit(): void {
    // Initialize canvas
    this.canvas = new Canvas('fabric-canvas');

    // Setup event callbacks
    this.canvas.on('selection:created', () => this.selectionChangedHandler());
    this.canvas.on('selection:updated', () => this.selectionChangedHandler());
    this.canvas.on('selection:cleared', () => this.selectionChangedHandler());

    // Add some shapes at startup
    this.addExampleShape('circle', false);
    this.addExampleShape('rectangle', false);
    this.addExampleShape('text', false)
    this.addExampleShape('polygon', false)
  }

  public selectionChangedHandler(): void {
    this.selectedObjects = this.canvas.getActiveObjects();
    this.log(`Selection updated, selectedObjects: ${this.selectedObjects}`);

    this.isPolygonSelected = (this.selectedObjects.length === 1 && this.selectedObjects[0] instanceof Polygon);
  }

  public addExampleShape(shape: 'circle' | 'rectangle' | 'text' | 'polygon', log = true): void {
    const position = {left: Math.random() * 600, top: Math.random() * 300};

    let newObject: Circle | Rect | Polygon | Textbox;
    if (shape === 'circle') {
      newObject = new Circle({...position, radius: Math.random() * 100, fill: 'green'})
    } else if (shape === 'rectangle') {
      newObject = new Rect({...position, width: Math.random() * 120, height: Math.random() * 80, stroke: 'red'});
    } else if (shape === 'polygon') {
      const points1 = [{x: 20, y: 50}, {x: 60, y: 30}, {x: 70, y: 80}, {x: 50, y: 100}, {x: 30, y: 80}];
      newObject = new Polygon(points1, {...position, fill: 'orange', strokeWidth: 2, stroke: 'black'});
      newObject.on('mousedblclick', () => this.polygonEditHandler(newObject as Polygon));
    } else {
      newObject = new Textbox('Hello World', {...position, width: 100, height: 20, fontSize: 24});
    }
    if (log) {
      this.log(`Added new fabricJs object: ${shape}`);
    }
    this.canvas.add(newObject)
  }

  private polygonEditHandler(polygon: Polygon): void {
    this.isEditingPolygon = !this.isEditingPolygon;
    this.log(`Changing Polygon controls to ${this.isEditingPolygon ? 'edit' : 'default'}`);
    if (this.isEditingPolygon) {
      polygon.cornerStyle = 'circle';
      polygon.cornerColor = 'rgba(0,0,255,0.5)';
      polygon.hasBorders = false;
      polygon.controls = controlsUtils.createPolyControls(polygon);
    } else {
      polygon.cornerColor = 'blue';
      polygon.cornerStyle = 'rect';
      polygon.hasBorders = true;
      polygon.controls = controlsUtils.createObjectDefaultControls();
    }
    polygon.setCoords();
    this.canvas.requestRenderAll();
  }

  public changeColor(): void {
    this.canvas.getActiveObjects().forEach(o => {
      o.set({fill: this.activeColor})
    });
    this.log(`Changed color to ${this.activeColor}`);
    this.canvas.requestRenderAll();
  }

  public drawNewPolygon(): void {
    this.isDrawingNewPolygon = true;
    // TODO
  }

  public editPolygon(): void {
    this.log(`Starting to edit Polygon`);
    this.polygonEditHandler(this.selectedObjects[0] as Polygon);
  }

  public deleteObjects(): void {
    this.log(`Deleting selected objects`);
    this.canvas.remove(...this.canvas.getActiveObjects());
    this.canvas.discardActiveObject();
    this.canvas.requestRenderAll();
  }

  private log(message: string): void {
    this.logs = message + '\n' + this.logs;
  }
}
