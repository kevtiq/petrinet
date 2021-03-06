import petrinet from '../src';

const places = [{ key: 'p1' }, { key: 'p2' }, { key: 'p3' }, { key: 'p4' }];
const transitions = [
  {
    key: 't1',
    input: [{ source: 'p1' }],
    output: [{ target: 'p2' }, { target: 'p4' }],
  },
  {
    key: 't2',
    input: [{ source: 'p2' }, { source: 'p4' }],
    output: [{ target: 'p3' }],
  },
  {
    key: 't3',
    input: [{ source: 'p3' }, { source: 'p4' }],
    output: [{ target: 'p1' }, { target: 'p4' }],
  },
  {
    key: 't4',
    input: [{ source: 'p4' }],
    output: [{ target: 'p4' }],
  },
];
const initialMarking = [{ place: 'p1', amount: 1 }];

describe('finite state machine', () => {
  let net;

  beforeEach(() => {
    net = petrinet(places, transitions);
    net.add({ place: 'p1', amount: 1 });
  });

  test('simple petrinet', () => {
    expect(net.marking).toEqual(initialMarking);
    net.fire('t4');
    net.fire('t10');
    expect(net.marking).toEqual(initialMarking);
    net.fire('t1');
    expect(net.marking).toEqual([
      { place: 'p2', amount: 1 },
      { place: 'p4', amount: 1 },
    ]);

    net.fire('t4');
    net.fire('t2');
    expect(net.marking).toEqual([{ place: 'p3', amount: 1 }]);
    net.add({ place: 'p1', amount: 2 });
    expect(net.marking).toEqual([
      { place: 'p1', amount: 2 },
      { place: 'p3', amount: 1 },
    ]);
    net.add({ place: 'p1', amount: 2 });
    expect(net.marking).toEqual([
      { place: 'p1', amount: 4 },
      { place: 'p3', amount: 1 },
    ]);

    net.add({ place: 'p10', amount: 1 });
    expect(net.marking).toEqual([
      { place: 'p1', amount: 4 },
      { place: 'p3', amount: 1 },
    ]);
  });
});
