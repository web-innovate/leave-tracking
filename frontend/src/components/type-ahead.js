import _ from 'lodash';
import { observable, bindable } from 'aurelia-framework';
import { UserService } from '~/services/user-service';

export class TypeAhead {
    @bindable tagsInput;
    @bindable dataSource
    @bindable field;
    @bindable results;
    @bindable displayName;
    @bindable placeholder;
    @bindable resultsResolver

    @bindable selectedData = [];

    state = null;

    constructor() {
        this.placeholder = this.placeholder || 'Search for ...';
    }

    selectedDataChanged(newVal, oldVal) {
        this.results = newVal.map(x => x[this.field]);
    }

    async attached() {
        if (this.results) {
            await Promise.all(this.results.map(async (result) => {
               const data = await this.resultsResolver(result);
               this.selectedData.push(data);
            }));
        }
    }

    async _dataSource(query, limit) {
        this.state = null;
        try {
            return await this.dataSource(query, limit);
        } catch(e) {
            return [];
        }
    }

    onSelect(item) {
        const obj = {};
        if (item == null) {
            return;
        }
        obj[this.field] = item[this.field];
        const indx = _.findIndex(this.selectedData, obj);

        if (indx !== -1) {
            return;
        }

        this.selectedData.push(item)
        this.results && this.results.push(item[this.field]);
    }

    removeTag(data) {
        const { field, selectedData } = this;

        this.selectedData = _.reject(selectedData, item => item[field] === data[field]);
    }
}
