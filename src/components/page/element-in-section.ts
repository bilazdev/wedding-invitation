export class ElementInSection {
    constructor(
        public element: HTMLElement,
        public sectionElement: HTMLElement
    ) {
    }

    getElementThreeJsPoint(): { x: number, y: number } {
        const sectionRect = this.sectionElement.getBoundingClientRect()
        const elementRect = this.element.getBoundingClientRect()

        const domTop = (elementRect.top - sectionRect.top);
        console.log(domTop)

        const domLeft = (elementRect.left - sectionRect.left);
        console.log(domLeft)

        console.log({
            domTop, domLeft
        })

        return {
            x: domLeft, y: sectionRect.height - domTop
        }
    }

    getElementThreeJsPointAtCenter(): { x: number, y: number } {
        const sectionRect = this.sectionElement.getBoundingClientRect()
        const elementRect = this.element.getBoundingClientRect()

        const domTop = (elementRect.top - sectionRect.top);
        console.log(domTop)

        const domLeft = (elementRect.left - sectionRect.left);
        console.log(domLeft)

        console.log({
            domTop, domLeft
        })

        return {
            x: domLeft + elementRect.width / 2, y: sectionRect.height - (domTop + elementRect.height / 2)
        }
    }
}
