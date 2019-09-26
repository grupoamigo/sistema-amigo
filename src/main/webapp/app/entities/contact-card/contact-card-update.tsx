import React from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col, Label } from 'reactstrap';
import { AvFeedback, AvForm, AvGroup, AvInput, AvField } from 'availity-reactstrap-validation';
import { Translate, translate, ICrudGetAction, ICrudGetAllAction, ICrudPutAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IRootState } from 'app/shared/reducers';

import { getEntity, updateEntity, createEntity, reset } from './contact-card.reducer';
import { IContactCard } from 'app/shared/model/contact-card.model';
import { convertDateTimeFromServer, convertDateTimeToServer } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';

export interface IContactCardUpdateProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export interface IContactCardUpdateState {
  isNew: boolean;
}

export class ContactCardUpdate extends React.Component<IContactCardUpdateProps, IContactCardUpdateState> {
  constructor(props) {
    super(props);
    this.state = {
      isNew: !this.props.match.params || !this.props.match.params.id
    };
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextProps.updateSuccess !== this.props.updateSuccess && nextProps.updateSuccess) {
      this.handleClose();
    }
  }

  componentDidMount() {
    if (this.state.isNew) {
      this.props.reset();
    } else {
      this.props.getEntity(this.props.match.params.id);
    }
  }

  saveEntity = (event, errors, values) => {
    if (errors.length === 0) {
      const { contactCardEntity } = this.props;
      const entity = {
        ...contactCardEntity,
        ...values
      };

      if (this.state.isNew) {
        this.props.createEntity(entity);
      } else {
        this.props.updateEntity(entity);
      }
    }
  };

  handleClose = () => {
    this.props.history.push('/entity/contact-card');
  };

  render() {
    const { contactCardEntity, loading, updating } = this.props;
    const { isNew } = this.state;

    return (
      <div>
        <Row className="justify-content-center">
          <Col md="8">
            <h2 id="sistemaAmigoApp.contactCard.home.createOrEditLabel">
              <Translate contentKey="sistemaAmigoApp.contactCard.home.createOrEditLabel">Create or edit a ContactCard</Translate>
            </h2>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="8">
            {loading ? (
              <p>Loading...</p>
            ) : (
              <AvForm model={isNew ? {} : contactCardEntity} onSubmit={this.saveEntity}>
                {!isNew ? (
                  <AvGroup>
                    <Label for="contact-card-id">
                      <Translate contentKey="global.field.id">ID</Translate>
                    </Label>
                    <AvInput id="contact-card-id" type="text" className="form-control" name="id" required readOnly />
                  </AvGroup>
                ) : null}
                <AvGroup>
                  <Label id="typeLabel" for="contact-card-type">
                    <Translate contentKey="sistemaAmigoApp.contactCard.type">Type</Translate>
                  </Label>
                  <AvInput
                    id="contact-card-type"
                    type="select"
                    className="form-control"
                    name="type"
                    value={(!isNew && contactCardEntity.type) || 'TELEFONO'}
                  >
                    <option value="TELEFONO">{translate('sistemaAmigoApp.ContactType.TELEFONO')}</option>
                    <option value="EMAIL">{translate('sistemaAmigoApp.ContactType.EMAIL')}</option>
                    <option value="WEBSITE">{translate('sistemaAmigoApp.ContactType.WEBSITE')}</option>
                    <option value="FACEBOOK">{translate('sistemaAmigoApp.ContactType.FACEBOOK')}</option>
                    <option value="TWITTER">{translate('sistemaAmigoApp.ContactType.TWITTER')}</option>
                    <option value="INSTAGRAM">{translate('sistemaAmigoApp.ContactType.INSTAGRAM')}</option>
                    <option value="LINKEDIN">{translate('sistemaAmigoApp.ContactType.LINKEDIN')}</option>
                    <option value="WHATSAPP">{translate('sistemaAmigoApp.ContactType.WHATSAPP')}</option>
                  </AvInput>
                </AvGroup>
                <AvGroup>
                  <Label id="valueLabel" for="contact-card-value">
                    <Translate contentKey="sistemaAmigoApp.contactCard.value">Value</Translate>
                  </Label>
                  <AvField
                    id="contact-card-value"
                    type="text"
                    name="value"
                    validate={{
                      required: { value: true, errorMessage: translate('entity.validation.required') }
                    }}
                  />
                </AvGroup>
                <Button tag={Link} id="cancel-save" to="/entity/contact-card" replace color="info">
                  <FontAwesomeIcon icon="arrow-left" />
                  &nbsp;
                  <span className="d-none d-md-inline">
                    <Translate contentKey="entity.action.back">Back</Translate>
                  </span>
                </Button>
                &nbsp;
                <Button color="primary" id="save-entity" type="submit" disabled={updating}>
                  <FontAwesomeIcon icon="save" />
                  &nbsp;
                  <Translate contentKey="entity.action.save">Save</Translate>
                </Button>
              </AvForm>
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = (storeState: IRootState) => ({
  contactCardEntity: storeState.contactCard.entity,
  loading: storeState.contactCard.loading,
  updating: storeState.contactCard.updating,
  updateSuccess: storeState.contactCard.updateSuccess
});

const mapDispatchToProps = {
  getEntity,
  updateEntity,
  createEntity,
  reset
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactCardUpdate);
