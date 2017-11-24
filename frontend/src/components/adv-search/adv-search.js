import { observable, bindable } from 'aurelia-framework';

export class AdvSearch {
    @bindable config;
    @bindable title;
    @bindable queryData = {};

    myCollection = [];
    queryCollection = [];
    selectedField = "";

    configChanged(newVal, oldVal) {
        if(!newVal) {
            return;
        }

        let aaa = Object.keys(newVal);

        let index = 0;
        aaa = aaa.map(i => {
            return {
                index: index++,
                field: i,
                data: newVal[i]
            }
        });

        this.myCollection = aaa;
    }

    addQuery() {
        this.queryCollection.push(this.selectedField);
    }

    get disableAdd() {
        return this.selectedField === 'None' || this.queryCollection.indexOf(this.selectedField) > -1;
    }

    showAll() {
        console.log('all', this)
    }

    deleteFilter(item) {
        this.queryCollection = this.queryCollection.filter(q => q !== item)
        delete this.queryData[item];
    }
}
