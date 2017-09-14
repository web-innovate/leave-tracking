import monq from 'monq';

import userWorkers from './users/userWorkers';

class Worker {
    get QUEUE_EVENTS() {
        return {
            USER: 'queue_user'
        };
    }

    get PROCESS_EVENTS() {
        return {
            USER: 'process_new_user'
        };
    }

    constructor() {
        if (!this.client) {
            this.client = monq(process.env.MONGO_HOST);
            this.workers = [];
        }
    }

    start() {
        this.registerWorkers();
        this.startWorkers();
    }

    queueNewUser(data) {
        const queue = this.client.queue(this.QUEUE_EVENTS.USER);

        queue.enqueue(this.PROCESS_EVENTS.USER, data, () => {});
    }

    registerWorkers() {
        this.registerUserWorkers();
    }

    registerUserWorkers() {
        const worker = this.client.worker([this.QUEUE_EVENTS.USER]);

        worker.register({
            process_new_user: userWorkers.handleNewUsers
        });

        this.workers.push(worker);
    }

    startWorkers() {
        this.workers.forEach(worker => worker.start());
    }
}

export default new Worker;
