# Rxmq.js convenience aliases

> A plugin that provides a set of convenience alises for Rxmq.js

## What is it?

This is a set of convenience aliases for Rxmq.js that provide bus-level and channel-level aliased functions to execute common tasks (e.g. subscribe, observe, onNext, etc).

## Quick start

To start, install the package from npm using `npm install rxmq.aliases` and then register plugins in Rxmq, like so:

```js
import Rxmq from 'rxmq';
import {BusAliases, ChannelAliases} from '../index';
// register aliases
Rxmq.registerPlugin(BusAliases);
Rxmq.registerChannelPlugin(ChannelAliases);
```

After that you'll have access to aliased methods that are described below.

## Included aliases

The package includes following aliases for Bus and Channel

### Bus-level aliases

Alias `Rxmq.subscribe()` allows subscribing to specific channel and topic from top level, e.g.:

```js
const subscription = Rxmq.subscribe({
    channel: 'posts',
    topic: 'post.add',
    // following methods are same as for Rx.Observable.subscribe
    onNext(data) {
        // handle new data ...
    },
    onError(error) {
        // handle error ...
    }
});
```

Alias `Rxmq.observe()` allows getting `Rx.Observable` for specific topic from top level, e.g.:
```js
Rxmq.observe({channel: 'posts', topic: 'post.add'}).subscribe((data) => {
    // handle new data
    // ...
});
```

Finally, alias `Rxmq.onNext()` allows dispatching data into specific topic and channel from top level, e.g.:
```js
Rxmq.onNext({
    channel: 'posts',
    topic: 'post.add',
    data: {
        title: 'Woo-hoo, first post!',
        text: 'My lengthy post here'
    }
});
```

### Channel-level aliases

Aliases `channel.subscribe(topic, {onNext})` and `channel.subscribe({topic, onNext})` provide a way to subscribe to topic with given functions, e.g.:
```js
const subscription = channel.subscribe({
    topic: 'name.change',
    onNext(data) {
        $('#example1').html('Name: ' + data.name);
    }
});

// alternative syntax
const subscription = channel.subscribe('name.change', {
    onNext(data) {
        $('#example1').html('Name: ' + data.name);
    }
});
```

Aliases `channel.onNext({topic, data})` and `channel.onNext(topic, {data})` allow publishing data to given topic, e.g.:
```js
channel.onNext({topic: 'name.changed', data: {type: 'Name', value: 'John Smith'}});
channel.onNext('location.changed', {data: {type: 'Location', value: 'Early 20th Century England'}});
```

Alias `channel.requestTo(topic, {data, Subject})` allows making a request to specific topic, e.g.:
```js
channel.requestTo('last.login', {data: {userId: 8675309}})
    .timeout(2000)
    .subscribe(
        (data) => console.log(`Last login for userId: ${data.userId} occurred on ${data.time}`),
        (err) => console.error('Uh oh! Error:', err),
        () => console.log('done!')
    );
```

## License

[MIT](http://www.opensource.org/licenses/mit-license)
