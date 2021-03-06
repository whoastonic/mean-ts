import {
  prop,
  Ref,
  getModelForClass,
  DocumentType,
} from '@typegoose/typegoose'

import { Base } from './base'
import { Species } from './species'
import { Schemas } from '@poke-app/api'

export class Pokemon extends Base {

  @prop()
  public nickname!: string

  @prop({
    required: true,
    ref: Species,
  })
  public species!: Ref<Species>

}

export const PokemonModel = getModelForClass(Pokemon, {
  schemaOptions: {
    collection: 'pokemon',
  },
})

export type PokemonDoc = DocumentType<Pokemon>

export type PokemonView = Schemas.PokemonView
