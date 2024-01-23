import { UserEntity } from '@entities/users.entity';
import { HttpException } from '@exceptions/HttpException';
import { User } from '@/interfaces/users.interface';
import { MS_EVENTS, MSEvent } from './index.socket';
import { ProductEntity } from '@/entities/product.entity';

class UserSocket {
  private userId: number;
  private socket: any;
  private user: User;

  constructor(id: number) {
    this.userId = id;
  }

  async init(socket) {
    if (this.socket) {
      this.socket.close();
    }

    this.socket = socket;
    this.socket.on('message', (message: string) => this.onMessage(message));

    const findUser = await UserEntity.findOne(this.userId, { select: ['id', 'email', 'firstName', 'lastName', 'role', 'group'] });
    if (!findUser) throw new HttpException(409, `This user id ${this.userId} was not found`);
    this.user = findUser;
    console.log(`user connected : email : ${this.user.email}`);

    const data = {
      user: findUser
    };

    const result: MSEvent = {
      name: MS_EVENTS.LOGIN,
      data: data
    };

    this.send(result);

    return findUser;
  }

  public getUser() {
    return this.user;
  }

  public getUserId() {
    return this.userId;
  }

  public async onMessage(message: string) {
    const msEvent = JSON.parse(message) as MSEvent;

    if (msEvent.data) {
      if (msEvent.name == MS_EVENTS.REQUEST) {
        const { query, entity } = msEvent.data;

        if (query) {
          const result = await ProductEntity.query(query);

          const event: MSEvent = {
            name: MS_EVENTS.RESPONSE,
            data: {
              entity,
              result
            }
          };

          this.send(event);
        }
      }
    }
  }

  public send(msEvent: MSEvent) {
    if (this.socket && this.socket.readyState <= 1) {
      this.socket.send(JSON.stringify(msEvent));
    }
  }

  public close() {
    this.socket.close();
  }
}

export default UserSocket;
