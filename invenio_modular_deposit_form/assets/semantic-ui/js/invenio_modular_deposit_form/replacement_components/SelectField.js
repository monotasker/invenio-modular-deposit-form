import React from "react";
import { FastField, Field, useFormikContext } from "formik";
import _isEmpty from "lodash/isEmpty";

import { Dropdown, Form } from "semantic-ui-react";
import { FieldLabel } from "react-invenio-forms";
import { i18next } from "@translations/invenio_rdm_records/i18next";

const SelectField = ({
  classnames = undefined,
  defaultValue = "",
  description = undefined,
  error = undefined,
  errorDirection = "above",
  fieldPath,
  helpText = undefined,
  label = "",
  labelIcon = undefined,
  onAddItem = undefined,
  onChange = undefined,
  optimized = false,
  options,
  multiple = false,
  noResultsMessage = "No results found.",
  required = false,
  selectOnBlur = false,
  width = undefined,
  ...otherProps
}) => {
  const FormikField = optimized ? FastField : Field;
  const { setFieldValue } = useFormikContext();

  const displayError = (meta) => {
    let error = meta.error;
    if (!Array.isArray(meta.value)) {
      if (
        !_isEmpty(options) &&
        !options.find(function (o) {
          return o.value === meta.value;
        }) &&
        !_isEmpty(meta.value)
      ) {
        error = 'The current value "'.concat(
          meta.value,
          '" is invalid, please select another value.'
        );
      }
    }
    return error
      ? {
          content: error,
          pointing: errorDirection,
        }
      : null;
  };

  const handleChange = (e, { value }) => {
    setFieldValue(fieldPath, value);
  };

  const {
    noQueryMessage,
    defaultFieldValue,
    ...uiProps
  } = otherProps;

  // TODO: implement extraRequiredFields, priorityFieldValues and defaultFieldValue

   return (
    <FormikField name={fieldPath} fieldPath={fieldPath} as="select" {...uiProps}>
      {({
        field, // { name, value, onChange, onBlur }
        form: { touched, errors, values, setFieldValue }, // also values, setXXXX, handleXXXX, dirty, isValid, status, initialValues, initialErrors, etc.
        meta,
      }) => {
        console.log("SelectField", field.value);
        console.log("SelectField otherProps", otherProps);
        console.log("SelectField options", options);
        const _defaultValue = defaultValue || (multiple ? [] : "");
        const formikProps = { field, form: {touched, errors, values, setFieldValue}, meta };
        console.log("SelectField formikProps", formikProps);
        return (
          <Form.Field
            error={meta.error && meta.touched ? true : undefined}
            width={width}
          >
            <FieldLabel htmlFor={fieldPath} icon={labelIcon} label={label} />
            {description && description !== " " && (
              <div className="helptext label top" id={`${fieldPath}.helptext`}>
                {i18next.t(description)}
              </div>
            )}
            <Dropdown
              {...((!!description || !!helpText) && {
                "aria-describedby": `${fieldPath}.helptext`
              })}
              fluid
              className={`invenio-select-field ${classnames ? classnames : ""}`}
              selection
              search
              error={meta.error && meta.touched ? true : undefined}
              id={fieldPath}
              multiple={multiple}
              label={{ children: label }}
              name={fieldPath}
              options={options}
              {...field}
              {...uiProps}
              selectOnBlur={selectOnBlur}
              {...(onChange && {
                onChange: (event, data) => {
                  onChange({event, data, formikProps});
                  handleChange(event, data);
                },
              })} // override onChange if extra logic is passed
              {...(onAddItem && {
                onAddItem: (event, data) => {
                  onAddItem({event, data, formikProps});
                }
              })}
              value={field.value || _defaultValue}
              noResultsMessage={noResultsMessage}
            />
            {meta.error && meta.touched && (
              <div
                className={`ui pointing above ${errorDirection} prompt label `}
                role="alert"
                aria-atomic="true"
              >
                {displayError(meta).content}
              </div>
            )}
            {helpText && helpText !== " " && (
              <div className="helptext label" id={`${fieldPath}.helptext`}>
                {i18next.t(helpText)}
              </div>
            )}
          </Form.Field>
        );
      }}
    </FormikField>
  );
};

export { SelectField };
