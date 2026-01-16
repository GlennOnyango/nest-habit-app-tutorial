import { Injectable } from '@nestjs/common';
import { StoreItemEntity } from './models/store-item.entity';

@Injectable()
export class InMemoryDbService {
  private store: Map<string, StoreItemEntity[]> = new Map();

  create<EntityModel extends StoreItemEntity>(
    entityName: string,
    input: EntityModel,
  ): EntityModel {
    this.getEntitiesStoreByName<EntityModel>(entityName).push(input);
    return input;
  }

  findAll<EntityModel extends StoreItemEntity>(
    entityName: string,
    query: { limit?: number; sortBy?: string },
  ): EntityModel[] {
    const { limit, sortBy } = query;
    const results = this.getEntitiesStoreByName<EntityModel>(entityName);

    if (sortBy) {
      results.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) {
          return -1;
        }
        if (a[sortBy] > b[sortBy]) {
          return 1;
        }
        return 0;
      });
    }

    if (limit) {
      return results.slice(0, limit);
    }
    return results;
  }

  findOneBy<EntityModel extends StoreItemEntity>(
    entityName: string,
    filter: { [key: string]: any },
  ): EntityModel | undefined {
    const entities = this.getEntitiesStoreByName<EntityModel>(entityName);

    return entities.find((entity) => {
      const isMatchingFilter = Object.keys(filter).every(
        (key) => entity[key] === filter[key],
      );
      return isMatchingFilter && entity;
    });
  }

  update<EntityModel extends StoreItemEntity>(
    entityName: string,
    id: string,
    updatedObject: EntityModel,
  ): EntityModel | undefined {
    const entities = this.getEntitiesStoreByName<EntityModel>(entityName);

    const entityPosition = this.getEntityIndex<EntityModel>(entities, id);

    if (entityPosition == -1) {
      return;
    }

    entities[entityPosition] = updatedObject;

    return entities[entityPosition];
  }

  delete<EntityModel extends StoreItemEntity>(
    entityName: string,
    id: string,
  ): EntityModel | undefined {
    const entities = this.getEntitiesStoreByName<EntityModel>(entityName);

    const entityIndex = this.getEntityIndex(entities, id);

    if (entityIndex === -1) {
      return;
    }

    const entity = entities[entityIndex];

    entities.splice(entityIndex, 1);

    return entity;
  }

  private getEntityIndex<EntityModel extends StoreItemEntity>(
    entities: EntityModel[],
    id: string,
  ): number {
    const index: number = entities.findIndex((entity) => entity.id === id);

    return index;
  }

  private getEntitiesStoreByName<EntityModel extends StoreItemEntity>(
    entityName: string,
  ): EntityModel[] {
    if (!this.store.has(entityName)) {
      this.store.set(entityName, []);
    }

    return this.store.get(entityName) as EntityModel[];
  }
}
