import odiff from 'odiff';
import {getPatch} from 'fast-array-diff';
import deepEqual from 'deep-equal';

onmessage = function({data: {
	newArr, oldArr
}}) {
    let changes = getPatch(oldArr, newArr, deepEqual);

    if (changes.length === 0) return;

    changes = changes.map(change => {
        return {
            type: change.type === 'remove' ? 'rm' : change.type,
            index: change.newPos,
            length: change.type === 'remove' ? change.items.length : undefined,
            vals: change.type === 'remove' ? undefined : change.items
        }
        return change;
    });
    // make rm + add on the same index into a set
    changes = changes.reduce((_changes_, cur) => {
        if (_changes_.length > 0) {
            let lastChange = _changes_[_changes_.length - 1];
            if (cur.type === 'add' && lastChange.type === 'rm' 
                && cur.index === lastChange.index
                && cur.vals.length === lastChange.length
            ) {
                _changes_.pop();

                return _changes_.concat({
                    index: cur.index,
                    vals: cur.vals,
                    type: 'set'
                })
            }
        }
        return _changes_.concat(cur);
    }, []);
    // aggregate those to be able to batch process them
    let aggregatedSetChange;
    changes = changes.reduce((_changes_, cur) => {
        if (cur.type === 'set') {
            if (aggregatedSetChange == null) {
                aggregatedSetChange = {
                    index: [],
                    vals: [],
                    type: 'set'
                }
            }
            cur.vals.map(val => {
                aggregatedSetChange.index.push(cur.index++);
                aggregatedSetChange.vals.push(val);
            })
            return _changes_;
        }
        if (aggregatedSetChange != null) {
            _changes_ = _changes_.concat(aggregatedSetChange);
            aggregatedSetChange = null;
        }
        return _changes_.concat(cur);
    }, []);
    if (aggregatedSetChange != null) {
        changes = changes.concat(aggregatedSetChange);
    }
    
    postMessage({
        changes: changes
    });
}