// run a queue that runs while it has members
// members can be functions or promises
export function PromiseQueue() {
    var current = Promise.resolve();
    var queueLength = 0;
    var onDoneCallbacks = [];

    return {
        add: (fn) => {
            queueLength++;
            current = current.then(() => {
                return new Promise((_resolve_, _reject_) => {
                    let result = fn();
                    // enable usage of promises in queue for async behaviour
                    if (result != null && typeof result.then === "function") {
                        result.then(_resolve_);
                    } else {
                        setImmediate(_resolve_)
                    }
                }).then(() => {
                    queueLength--;
                    // if there are no more promises to execute, notify outside that we are done
                    if (queueLength === 0) {
                        onDoneCallbacks.forEach(callback => callback());
                    }
                });
            });
            return current;
        },
        onDone: (callback) => {
            onDoneCallbacks.push(callback);
        }
    }
}

// collect the results from running a set of functions one after another
// call a functions with the results until the end of a certain timeframe
export function timedBatchProcessing(queueFnArr, batchCallback, maxTimePerChunk) {
    let queue = PromiseQueue();
    let results = [];
    maxTimePerChunk = maxTimePerChunk || 200;
    
    let startTime = now();
    queueFnArr.forEach(fn => {
        queue.add(() => {
            if ((now() - startTime) > maxTimePerChunk) {
                startTime = now();
                batchCallback && batchCallback(results);
                results = [];
            }
            if (typeof fn.then === 'function') {
                return fn.then(partial => results = results.concat(fn))
            }
            results = results.concat(fn());
        })
    });
    return queue.add(() => {
        if (results.length > 0) {
            batchCallback && batchCallback(results);
        }
    });
} 
			
function now() {
	return new Date().getTime();
}