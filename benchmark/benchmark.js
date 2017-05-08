// var Benchmark = require('benchmark');
import {h, UPDATE_DONE} from '../src';
var suite = new Benchmark.Suite;

var listOf = (length) => {
    var arr = [];
    for (let i = 0; i < length; i++) {
        arr.push({ name: i });
    }
    let listElems = arr.map(x => <li>{x.name}</li>);
    let listElem = <ul>
        { listElems }
    </ul>;
    return listElem;
}

var parentElem;
// add tests
suite
.add('Render 100 items',  {
    'teardown': function () {
        document.querySelector('#app').innerHTML = '';
    },
    'fn': function (deferred) {
        var listElem = listOf(100);
        document.querySelector('#app').appendChild(listElem);
        // we wait for the updates on the parent to have happened
        listElem.addEventListener(UPDATE_DONE, () => {
            deferred.resolve();
        });
    },
    'defer': true
  })
.add('Render 1000 items',  {
    'teardown': function () {
        document.querySelector('#app').innerHTML = '';
    },
    'fn': function (deferred) {
        var listElem = listOf(1000);
        document.querySelector('#app').appendChild(listElem);
        // we wait for the updates on the parent to have happened
        listElem.addEventListener(UPDATE_DONE, () => {
            deferred.resolve();
        });
    },
    'defer': true
  })
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
})
// run async
.run({ 'async': true });