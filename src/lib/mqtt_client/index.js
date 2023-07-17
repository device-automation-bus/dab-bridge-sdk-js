/**
 Copyright 2019 Amazon.com, Inc. or its affiliates.
 Copyright 2019 Netflix Inc.
 Copyright 2019 Google LLC
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
 http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

import { connect } from './client.js';

/**
 * @typedef {Object} Message
 * @property {string} type
 * @property {object} data
 */

/**
 * @callback HandlerCallback
 * @param {function(Message)}
 */

/**
 * @class
 */
export class MqttClient {

    #started;
    #handlers;
    #mqtt;

    constructor() {
        this.#started = false;
        this.#handlers = [];
        this.#mqtt = null;
    }

    /**
     * Associates a function to process incoming requests with a specific topic
     * @param  {string} path
     * @param  {HandlerCallback} handler
     */
    handle(path, handler) {
        this.#handlers.push({ path, handler });
    }

    /**
     * Publishes a request to a topic and waits for a response or timeout to occur
     * @param  {string} topic
     * @param  {{}} payload
     * @param  {MqttOptions} [options]
     */
    request(topic, payload, options) {
        return this.#mqtt.request.call(this.#mqtt, topic, payload, options);
    }

    /**
     * Subscribes to a topic, invoking callback function on each new message
     * until subscription.end() is called
     * @param  {string} topic
     * @param  {SubscriptionCallback} callback
     * @returns {Subscription} subscription
     */
    subscribe(topic, callback) {
        return this.#mqtt.subscribe.call(this.#mqtt, topic, callback);
    }

    /**
     * Subscribes to a topic until first message is received or timeout occurs,
     * convenience function for reading a retained message
     * @param  {string} topic
     * @param  {number} [timeoutMs]
     */
    subscribeOnce(topic, timeoutMs = 2000) {
        return new Promise( async (resolve, reject) => {
            const timer = setTimeout(() => reject(new Error(`Failed to receive response from ${topic} within ${timeoutMs}ms`)), timeoutMs);
            this.sub = await this.subscribe(
                topic, async (message) => {
                    await this.sub.end();
                    clearTimeout(timer);
                    return resolve(message);
                }
            );
        });
    }

    /**
     * Publishes a request to a topic where no response is expected
     * @param  {string} topic
     * @param  {{}} payload
     * @param  {MqttOptions} [options]
     */
    publish(topic, payload, options) {
        return this.#mqtt.publish.call(this.#mqtt, topic, payload, options);
    }

    /**
     * Publishes a retained message to a topic
     * @param  {string} topic
     * @param  {{}} payload
     * @param  {MqttOptions} [options]
     */
    publishRetained(topic, payload, options= {}) {
        options = Object.assign(options, { retain: true });
        return this.#mqtt.publish.call(this.#mqtt, topic, payload, options);
    }

    /**
     * Removes a previously published retained message from a topic
     * @param  {string} topic
     * @param  {MqttOptions} [options]
     */
    clearRetained(topic, options= {}) {
        options = Object.assign(options, { retain: true });
        return this.#mqtt.publish.call(this.#mqtt, topic, undefined, options);
    }

    /**
     * A single MqttClient should be created per application and init should be called once.
     * It will return once a connection to the MQTT broker is established, and does not time out.
     */
    async init(uri, deviceId) {
        if (!this.#started) {
            this.#started = true;
            this.#mqtt = await connect(uri, deviceId);
            this.#attachHandlers(this.#handlers);
        } else {
            throw new Error("init can only be called once!");
        }

        this.#started = true;
        return this;
    }

    async stop() {
        if (this.#started) {
            this.#mqtt.end();
            this.#started = false;
        }
    }

    /**
     * @private
     */
    #attachHandlers(handlers) {
        handlers.forEach(({ path, handler }) => {
            this.#mqtt.handle(path, async (...args) => {
                let response = handler(...args);
                if (response instanceof Promise) {
                    response = await response;
                }

                return response;
            });
        });
    }
}
