type Send = (name: string) => void;
type Node = {
  on?: Record<string, string>;
  effect?(send: Send): void;
};

type Config = Record<string, Node>;
type Machine = { send: Send; state: { value: string } };

// wrap a machine in a service
export default function fsm(init: string, states: Config): Machine {
  let _state = Object.freeze({ value: init });

  function send(name: string): void {
    const event = states[_state.value].on?.[name];
    if (!event || !states[event]) return;

    _state = Object.freeze({ value: event });
    states[event].effect?.(send), 0;
  }

  return {
    get state() {
      return _state;
    },
    send,
  };
}
