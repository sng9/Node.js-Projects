// State Pattern
// based on state; strategy changes
export class WarehouseItem {
    constructor(id, state) {
        this.id = id
        this.state = state 
        this.itemStatus = new Map() 
        this.states = ['ARRIVING', 'STORED', 'DELIVERED']
        this.arrival()
    }

    arrival() {
        const arrivalStrategy =  new ArrivalStrategy()
        if (arrivalStrategy.validateState(this.state)) {
            arrivalStrategy.describe(this.id, this.itemStatus)
        } else {
            throw new Error(`Item ${this.id} already present or not arrived in the warehouse`)
        }
        
    }

    store(locationInfo) {

        const storeStrategy = new StoreStrategy()
        if (storeStrategy.validateState(this.state)) {
            this.state = this.states[1]
            storeStrategy.describe(this.id, this.itemStatus, locationInfo)
        } else {
            throw new Error(`Item ${this.id} not yet arrived`) 
        }
    }

    deliver(address) {

        const deliverStrategy = new DeliverStrategy()
        if (deliverStrategy.validateState(this.state) ) {
            this.state = this.states[2]
            deliverStrategy.describe(this.id, this.itemStatus, address)
        } else {
            throw new Error(`Item ${this.id} was never stored`)
        }
    }

    describe() {
        let description = `${this.state === this.states[0] ? this.itemStatus.get(this.id) : 
                            this.state === this.states[1] ? this.itemStatus.get(this.id) :
                              this.state === this.states[2] ? this.itemStatus.get(this.id): 'N/A'}`
        
        console.log(description + "\n")
    }
}

export class ArrivalStrategy {

    validateState(state) {
        return state === 'ARRIVING' ? true : false
    }

    describe(itemID, itemStatus) {
        let currStatus = `Item ${itemID} is on the way`
        itemStatus.set(itemID, currStatus)
        
    } 
}

export class StoreStrategy {

    validateState(state) {
        return state === 'ARRIVING' ? true : false
    }

    describe(itemID, itemStatus, location) {
        let currStatus = `Item ${itemID} is stored on ${location}`
        itemStatus.set(itemID, currStatus)
    }
}

export class DeliverStrategy {

    validateState(state) {
        return state === 'STORED' ? true : false
    }

    describe(itemID, itemStatus, address) {
        let currStatus = `Item ${itemID} was delivered to ${address}`
        itemStatus.set(itemID, currStatus)
    }
}

const item1 = new WarehouseItem('1', 'ARRIVING')
item1.describe()

item1.store('Loc123') 
item1.describe()

item1.deliver('South NY')

item1.describe()

const item2 = new WarehouseItem('2', 'STORED')

item2.describe()
item2.deliver('North NY')