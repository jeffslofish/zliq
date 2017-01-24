import { h } from './utils/streamy-hyperscript';
import { SUBTRACT } from './reducers/clicks';

export const CleverComponent = ({sinks: {store}}) => {
	return store.$('clicks.clicks').map(clicks => {
		return <div>Clicks again {clicks}</div>;
	});
};

export const DumbComponent = ({sinks: {store}}) =>
	<button onclick={() => store.dispatch({type: SUBTRACT})}>subtract</button>;