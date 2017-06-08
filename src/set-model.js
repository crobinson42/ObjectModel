import {initModel, Model} from "./model"
import {checkAssertions, checkDefinition} from "./definition"
import {extend, setConstructor, toString} from "./helpers"

const SET_MUTATOR_METHODS = ["add", "delete", "clear"]

export default function SetModel() {

	const model = function (iterable) {
		const _set = new Set(iterable)
		if (!model.validate(_set)) return

		for (let method of SET_MUTATOR_METHODS) {
			_set[method] = function () {
				const testSet = new Set(_set)
				Set.prototype[method].apply(testSet, arguments)
				model.validate(testSet)
				return Set.prototype[method].apply(_set, arguments)
			}
		}

		setConstructor(_set, model)
		return _set
	}

	extend(model, Set)
	setConstructor(model, SetModel);
	initModel(model, arguments)
	return model
}

extend(SetModel, Model, {
	toString(stack){
		return "Set of " + toString(this.definition, stack)
	},

	_validate(_set, path, errors, stack){
		if (_set instanceof Set) {
			for (let item of _set.values()) {
				checkDefinition(item, this.definition, (path || "Set"), errors, stack)
			}
		} else {
			errors.push({
				expected: this,
				received: _set,
				path
			})
		}
		checkAssertions(_set, this, errors)
	}
})