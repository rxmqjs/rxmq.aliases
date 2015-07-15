/* global describe, it */
import should from 'should';
import Rxmq from 'rxmq';
import {BusAliases, ChannelAliases} from '../index';
// register aliases
Rxmq.registerPlugin(BusAliases);
Rxmq.registerChannelPlugin(ChannelAliases);

// test
describe('Rxmq', () => {
    it('should use Rxmq.subscribe() and Rxmq.observe() to subsribe, plus Rxmq.onNext() to publish', (done) => {
        const topic = 'oneToManyGlobal';
        const testMessage = 'test message';
        let called = 0;
        const onNext = (it) => {
            should(it).equal(testMessage);
            called++;
            if (called === 2) {
                done();
            }
        };

        Rxmq.subscribe({channel: 'test', topic, onNext});
        Rxmq.observe({channel: 'test', topic}).subscribe(onNext);
        Rxmq.onNext({channel: 'test', topic, data: testMessage});
    });

    describe('#channel()', () => {
        it('should use channel.onNext() to publish data', (done) => {
            const topic = 'oneToManyChannelPublish';
            const channelName = 'test';
            const channel = Rxmq.channel(channelName);
            const sub = channel.observe(topic);
            const testData = 'testGlobalPush';
            sub.subscribe((data) => {
                should(data).equal(testData);
                done();
            });

            channel.onNext({topic, data: testData});
        });

        it('should use channel.requestTo(topic, {data}) for request', (done) => {
            const topic = 'request-reply';
            const channel = Rxmq.channel('test');
            const rrSub = channel.subject(topic);
            const testRequest = 'test request';
            const testReply = 'test reply';

            rrSub.subscribe(({data, replySubject}) => {
                should(data).equal(testRequest);
                replySubject.onNext(testReply);
                replySubject.onCompleted();
            });
            channel.requestTo(topic, {data: testRequest})
                .subscribe((replyData) => {
                    should(replyData).equal(testReply);
                    done();
                });
        });

        it('should use channel.subscribe(topic, {onNext}) for subscription', (done) => {
            const topic = 'oneToManyAliasPublish';
            const channel = Rxmq.channel('test');
            const testData = 'testGlobalPush';
            channel.subscribe(topic, {
                onNext: (data) => {
                    should(data).equal(testData);
                    done();
                },
            });

            channel.onNext(topic, {data: testData});
        });

        it('should use channel.subscribe({topic, onNext}) for subscription', (done) => {
            const topic = 'oneToManyOtherAliasPublish';
            const channel = Rxmq.channel('test');
            const testData = 'testGlobalPush';
            channel.subscribe({
                topic,
                onNext: (data) => {
                    should(data).equal(testData);
                    done();
                },
            });

            channel.onNext(topic, {data: testData});
        });
    });
});
