import {
  TypeDoc,
  TypeModel,
  Type,
} from '@api/models/type'
import {
  PostType,
  PatchType$Name,
} from '@poke-app/api'

export async function getAll (): Promise<Array<TypeDoc>> {
  const models = await TypeModel.find()

  return models
}

export async function getByName (
  name: string,
): Promise<TypeDoc | undefined> {
  const model = await TypeModel.findOne({
    name,
  })

  return model ?? undefined
}

export async function createOne (
  data: PostType.RequestBody,
): Promise<TypeDoc> {
  const model = await TypeModel.create(data)

  return model
}

export async function updateOne (
  name: string,
  data: PatchType$Name.RequestBody,
): Promise<TypeDoc | undefined> {
  const model = await TypeModel.findOneAndUpdate({
    name,
  }, data, { new: true })

  return model ?? undefined
}

export async function deleteOne (
  name: string,
): Promise<void> {
  await TypeModel.findOneAndMarkDeleted<Type>({
    name,
  })
}
