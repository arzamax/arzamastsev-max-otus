type QueueItem = {
  value: number;
  readerIndex: number;
};

export class Queue {
  private items: QueueItem[] = [];

  public add(item: QueueItem) {
    this.items.push(item);
    this.items.sort((a, b) => b.value - a.value);
  }

  public pop() {
    return this.items.pop();
  }

  get isEmpty() {
    return !this.items.length;
  }
}
