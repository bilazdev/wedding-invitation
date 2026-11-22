import { Vector3 } from "three";

export class Step {
    constructor(
        public element: HTMLElement,
        public sectionElement: HTMLElement,
        public positionOffset: Vector3 = new Vector3(),
        public rotation: Vector3 = new Vector3(),
        public size: number = 100
    ) { }

    getCentroidPosition(): { x: number, y: number, z: number } {
        const sectionRect = this.sectionElement.getBoundingClientRect()
        const elementRect = this.element.getBoundingClientRect()

        const domTop = (elementRect.top - sectionRect.top);
        console.log(domTop)

        const domLeft = (elementRect.left - sectionRect.left);
        console.log(domLeft)

        console.log({
            domTop, domLeft
        })

        const centroidX = domLeft + elementRect.width / 2;
        const centroidY = sectionRect.height - (domTop + elementRect.height / 2);

        const xWithOffest = centroidX + this.positionOffset.x * elementRect.width;
        const yWithOffest = centroidY + this.positionOffset.y * elementRect.height;

        return {
            x: xWithOffest,
            y: yWithOffest,
            z: 0 + this.positionOffset.z
        }
    }

    getSize() {
        const elementRect = this.element.getBoundingClientRect()
        return this.size * elementRect.width;

    }
}
