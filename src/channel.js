/**
 * Rxmq channel class
 */
export const ChannelAliases = {
    /**
     * Alias for subscription to a specific topic using given handler functions
     * @param  {Object}        options      Subscription options
     * @param  {String}        options.topic        Topic name
     * @param  {Function}      options.onNext       Function handler for Rx.Observable onNext
     * @param  {Function}      options.onError      Function handler for Rx.Observable onError
     * @param  {Function}      options.onCompleted  Function handler for Rx.Observable onCompleted
     * @return {Rx.Disposable}                      Disposable subscription
     * @example
     * const channel = rxmq.channel('test');
     * channel.subscribeTo({
     *     topic: 'test.topic',
     *     onNext: (res) => {
     *         // handle stuff here
     *     },
     *     onError: console.error,
     *     onCompleted: () => console.log('done!'),
     * });
     */
    subscribeTo({topic, onNext, onError, onCompleted}) {
        return this.observe(topic).subscribe(onNext, onError, onCompleted);
    },

    /**
     * Alternative alias for subscription to specific topic using given handler functions
     * @param  {(String|Object)} topic                  Topic name or options object formatted like for '.subscribeTo()'
     * @param  {Object}          options                Handlers object
     * @param  {Function}        options.onNext         Function handler for Rx.Observable onNext
     * @param  {Function}        options.onError        Function handler for Rx.Observable onError
     * @param  {Function}        options.onCompleted    Function handler for Rx.Observable onCompleted
     * @return {Rx.Disposable}                          Disposable subscription
     * @example
     * const channel = rxmq.channel('test');
     * channel.subscribe('test.topic', {
     *     onNext: (res) => {
     *         // handle stuff here
     *     },
     *     onError: console.error,
     *     onCompleted: () => console.log('done!'),
     * });
     */
    subscribe(topic, {onNext, onError, onCompleted} = {}) {
        if (typeof topic === 'object') {
            const {topic: newTopic, onNext: newOnNext, onError: newOnError, onCompleted: newOnCompleted} = topic;
            topic = newTopic;
            onNext = newOnNext;
            onError = newOnError;
            onCompleted = newOnCompleted;
        }

        return this.subscribeTo({topic, onNext, onError, onCompleted});
    },

    /**
     * Alias for a trigger '.onNext()' for specific topic
     * @param  {String} topic       Topic name
     * @param  {Object} data      Data to dispatch
     * @return {void}
     * @example
     * const channel = rxmq.channel('test');
     * channel.onNextTo({
     *     topic: 'test.topic',
     *     data: 'test data',
     * });
     */
    onNextTo({topic, data}) {
        this.subject(topic).onNext(data);
    },

    /**
     * Alternative alias for a trigger '.onNext()' for specific topic
     * @param  {(String|Object)} topic      Topic name or params object formatted like for `.onNextTo()`
     * @param  {Object}          data       Data to dispatch
     * @return {void}
     * @example
     * const channel = rxmq.channel('test');
     * channel.onNext('test.topic', {
     *     data: 'test data',
     * });
     */
    onNext(topic, {data} = {}) {
        if (typeof topic === 'object') {
            const {topic: newTopic, data: newData} = topic;
            topic = newTopic;
            data = newData;
        }

        this.onNextTo({topic, data});
    },

    /**
     * Do a request that will be replied into returned Rx.AsyncSubject
     * @param  {(String|Object)} topic                   Topic name or options object formatted like for '.requestTo()'
     * @param  {Object}          options                 Request options
     * @param  {Object}          options.data            Request data
     * @param  {Object}          options.DefaultSubject  Rx.Subject to be used for response, defaults to Rx.AsyncSubject
     * @return {Rx.AsyncSubject}                         AsyncSubject that will dispatch the response
     * @example
     * const channel = rxmq.channel('test');
     * channel.request('test.topic', {
     *     data: 'test data',
     * }).subscribe((response) => { // default Rx.Observable subscription
     *     // handle response
     * });
     */
    requestTo(topic, {data, Subject} = {}) {
        return this.request({topic, data, Subject});
    },
};
