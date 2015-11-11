var SchemaStore = require('../../schema/store');

export default {
  methods: {
    validate() {
      var model = this.model;
      var schema = this.fieldSchema;

      if (schema) {
        schema.$validateProperty(model, this.property);

        this.hintType = model.$hintTypes[this.property];
        this.hintMessage = model.$hints[this.property];
      }
    }
  },

  computed: {
    isRequired() {
      var property = this.property;
      var schema = this.fieldSchema;

      if (schema && property) {
        return !!schema.$getPropertyDescriptor(property).required;
      }

      return this.required;
    },

    fieldSchema() {
      var schema = this.schema;
      if (!schema && this.form) {
        schema = this.form.schema;
      }

      if (typeof schema === 'string') {
        schema = this.schema = SchemaStore.getSchema(schema);
      }

      return schema;
    }
  },

  onCreated() {
    if (this.$parent.$isForm) {
      this.form = this.$parent;
    }
  },

  onCompiled() {
    if (this.form && !this.labelWidth && this.form.labelWidth) {
      this.labelWidth = this.form.labelWidth;
    }

    if (this.property) {
      if (!this.model && this.form) {
        this.model = this.form.model;
      }

      this.$watch('model.' + this.property, function() {
        this.validate();
      });

      var property = this.property;
      if (!property) return;

      var schema = this.fieldSchema;
      if (!schema) return;

      if (!this.label) {
        this.label = schema.$getPropertyLabel(property);
      }

      var mapping = schema.$getPropertyMapping(property);
      if (!mapping) return;

      this.mapping = mapping;
    }
  },

  props: {
    form: {},
    model: {
      default() {
        return {}
      }
    },
    labelWidth: {},
    property: {},
    schema: {},
    label: {
      type: String
    },
    hintType: {
      type: String,
      default: ''
    },
    hintMessage: {
      type: String
    }
  }
};