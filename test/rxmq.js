import test from 'tape';
import Rxmq from 'rxmq';
import {BusAliases, ChannelAliases} from '../index';
// register aliases
Rxmq.registerPlugin(BusAliases);
Rxmq.registerChannelPlugin(ChannelAliases);

// test
test('Rxmq', (it) => {
    it.test('# should use Rxmq.subscribe() and Rxmq.observe() to subsribe, plus Rxmq.onNext() to publish', (t) => {
        const topic = 'oneToManyGlobal';
        const testMessage = 'test message';
        let called = 0;
        t.plan(2);
        const onNext = (item) => {
            t.equal(item, testMessage);
            called++;
        };

        Rxmq.subscribe({channel: 'test', topic, onNext});
        Rxmq.observe({channel: 'test', topic}).subscribe(onNext);
        Rxmq.onNext({channel: 'test', topic, data: testMessage});
    });

    it.test('> channel()', (subit) => {
        subit.test('# should use channel.onNext() to publish data', (t) => {
            const topic = 'oneToManyChannelPublish';
            const channelName = 'test';
            const channel = Rxmq.channel(channelName);
            const sub = channel.observe(topic);
            const testData = 'testGlobalPush';
            sub.subscribe((data) => {
                t.equal(data, testData);
                t.end();
            });

            channel.onNext({topic, data: testData});
        });

        subit.test('# should use channel.requestTo(topic, {data}) for request', (t) => {
            const topic = 'request-reply';
            const channel = Rxmq.channel('test');
            const rrSub = channel.subject(topic);
            const testRequest = 'test request';
            const testReply = 'test reply';

            rrSub.subscribe(({data, replySubject}) => {
                t.equal(data, testRequest);
                replySubject.onNext(testReply);
                replySubject.onCompleted();
            });
            channel.requestTo(topic, {data: testRequest})
                .subscribe((replyData) => {
                    t.equal(replyData, testReply);
                    t.end();
                });
        });

        subit.test('# should use channel.subscribe(topic, {onNext}) for subscription', (t) => {
            const topic = 'oneToManyAliasPublish';
            const channel = Rxmq.channel('test');
            const testData = 'testGlobalPush';
            channel.subscribe(topic, {
                onNext: (data) => {
                    t.equal(data, testData);
                    t.end();
                },
            });

            channel.onNext(topic, {data: testData});
        });

        subit.test('# should use channel.subscribe({topic, onNext}) for subscription', (t) => {
            const topic = 'oneToManyOtherAliasPublish';
            const channel = Rxmq.channel('test');
            const testData = 'testGlobalPush';
            channel.subscribe({
                topic,
                onNext: (data) => {
                    t.equal(data, testData);
                    t.end();
                },
            });

            channel.onNext(topic, {data: testData});
        });
    });
});
