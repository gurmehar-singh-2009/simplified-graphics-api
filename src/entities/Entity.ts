export abstract class Entity {
	abstract init(): void;
	// abstract render(): void; // LATER: we should construct a way so that we can parse and render ts regardless of backend
	// maybe just return a bunch of Commands?
}
