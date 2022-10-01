import { clearV1 } from './other';
import { channelsListV1 } from './channels';

test('Test the data has been clear',() => {
	// how to pass in authid?
    expect (channelsListV1()).toStrictEqual({});
});

