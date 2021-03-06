import {
  PokemonDoc,
  PokemonModel,
} from '@api/models/pokemon'
import {
  getByNumber as getSpeciesByNumber,
  populate as populateSpecies,
} from './species'
import {
  BadRequestError,
  ServerError,
} from '@utils/error'
import { isDocument } from '@typegoose/typegoose'
import {
  PostPokemon,
  PatchPokemon$Id,
} from '@poke-app/api'
import { populateWithDeleted } from '@utils/populateWithDeleted'

export function populate (pokemon: PokemonDoc): Promise<PokemonDoc>
export function populate (
  pokemon: Array<PokemonDoc>
): Promise<Array<PokemonDoc>>
export function populate (
  pokemon: PokemonDoc | Array<PokemonDoc>,
): Promise<PokemonDoc | Array<PokemonDoc>> {
  const populatePath = 'species'

  return Array.isArray(pokemon)
    ? Promise.all(
      pokemon.map(
        (p) => populateWithDeleted(p, populatePath)
          .then(async (p1) => {
            if (!isDocument(p1.species)) {
              throw new ServerError('ripip')
            }

            p1.species = await populateSpecies(p1.species)
            return p1
          }),
      ),
    ) : populateWithDeleted(pokemon, populatePath)
      .then(async (p) => {
        if (!isDocument(p.species)) {
          throw new ServerError('ripip')
        }

        p.species = await populateSpecies(p.species)
        return p
      })
}

export async function getAll (): Promise<Array<PokemonDoc>> {
  const models = await PokemonModel.find()

  return populate(models)
}

export async function getById (
  _id: string,
): Promise<PokemonDoc | undefined> {
  const model = await PokemonModel.findOne({
    _id,
  })

  if (model) {
    return populate(model)
  }

  return model ?? undefined
}

export async function createOne (
  data: PostPokemon.RequestBody,
): Promise<PokemonDoc> {
  const {
    species,
    ...rest
  } = data

  const sp = await getSpeciesByNumber(species)

  if (!sp) {
    throw new BadRequestError('Unknown Species')
  }

  const model = await PokemonModel.create({
    ...rest,
    species: sp,
  })

  return populate(model)
}

export async function updateOne (
  pokemon: PokemonDoc,
  data: PatchPokemon$Id.RequestBody,
): Promise<PokemonDoc> {
  const {
    species,
    nickname,
    ...rest
  } = data

  if (nickname) {
    pokemon.set({
      nickname,
    })
  } else if (nickname === '') {
    pokemon.set({
      nickname: undefined,
    })
  }

  if (species) {
    const s = await getSpeciesByNumber(species)
    if (!s) {
      throw new BadRequestError('Unknown Species')
    }
    pokemon.set({
      species: s,
    })
  }

  pokemon.set(rest)

  return populate(await pokemon.save())
}

export async function deleteOne (
  pokemon: PokemonDoc,
): Promise<void> {
  await pokemon.markDeleted()
}
