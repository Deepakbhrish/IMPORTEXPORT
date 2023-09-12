using {deepak} from '../db/data-model';

service CatalogService {
    entity Books as projection on deepak.Books;
}
